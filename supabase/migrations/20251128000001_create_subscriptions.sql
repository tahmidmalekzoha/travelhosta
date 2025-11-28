-- Create subscription_status enum
CREATE TYPE public.subscription_status AS ENUM ('active', 'expired', 'cancelled', 'pending');

-- Create user_subscriptions table
CREATE TABLE IF NOT EXISTS public.user_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Subscription details
    status public.subscription_status NOT NULL DEFAULT 'pending',
    subscribed_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ, -- NULL for lifetime subscriptions
    
    -- Payment details
    payment_method TEXT, -- e.g., 'bkash', 'nagad', 'card', etc.
    payment_transaction_id TEXT,
    payment_amount DECIMAL(10, 2),
    payment_currency TEXT DEFAULT 'BDT',
    
    -- Metadata
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Constraints
    UNIQUE(user_id) -- One subscription per user
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON public.user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_status ON public.user_subscriptions(status);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_user_subscriptions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_user_subscriptions_updated_at_trigger ON public.user_subscriptions;
CREATE TRIGGER update_user_subscriptions_updated_at_trigger
    BEFORE UPDATE ON public.user_subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION public.update_user_subscriptions_updated_at();

-- Function to check if user has active subscription
CREATE OR REPLACE FUNCTION public.has_active_subscription(p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    v_status public.subscription_status;
    v_expires_at TIMESTAMPTZ;
BEGIN
    SELECT status, expires_at INTO v_status, v_expires_at
    FROM public.user_subscriptions
    WHERE user_id = p_user_id;
    
    -- No subscription record means not subscribed
    IF NOT FOUND THEN
        RETURN FALSE;
    END IF;
    
    -- Check if subscription is active
    IF v_status = 'active' THEN
        -- If expires_at is NULL, it's a lifetime subscription
        IF v_expires_at IS NULL THEN
            RETURN TRUE;
        END IF;
        
        -- Check if subscription hasn't expired
        IF v_expires_at > NOW() THEN
            RETURN TRUE;
        ELSE
            -- Subscription has expired, update status
            UPDATE public.user_subscriptions
            SET status = 'expired'
            WHERE user_id = p_user_id;
            RETURN FALSE;
        END IF;
    END IF;
    
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create/update subscription (for admin use)
CREATE OR REPLACE FUNCTION public.upsert_subscription(
    p_user_id UUID,
    p_status public.subscription_status,
    p_payment_method TEXT DEFAULT NULL,
    p_payment_transaction_id TEXT DEFAULT NULL,
    p_payment_amount DECIMAL DEFAULT 149.00,
    p_expires_at TIMESTAMPTZ DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
    v_subscription_id UUID;
    v_subscribed_at TIMESTAMPTZ;
BEGIN
    -- Check if subscription exists
    SELECT id, subscribed_at INTO v_subscription_id, v_subscribed_at
    FROM public.user_subscriptions
    WHERE user_id = p_user_id;
    
    IF FOUND THEN
        -- Update existing subscription
        UPDATE public.user_subscriptions
        SET 
            status = p_status,
            payment_method = COALESCE(p_payment_method, payment_method),
            payment_transaction_id = COALESCE(p_payment_transaction_id, payment_transaction_id),
            payment_amount = COALESCE(p_payment_amount, payment_amount),
            expires_at = p_expires_at,
            subscribed_at = CASE 
                WHEN p_status = 'active' AND subscribed_at IS NULL THEN NOW()
                ELSE subscribed_at
            END
        WHERE user_id = p_user_id
        RETURNING id INTO v_subscription_id;
    ELSE
        -- Create new subscription
        INSERT INTO public.user_subscriptions (
            user_id,
            status,
            payment_method,
            payment_transaction_id,
            payment_amount,
            expires_at,
            subscribed_at
        ) VALUES (
            p_user_id,
            p_status,
            p_payment_method,
            p_payment_transaction_id,
            p_payment_amount,
            p_expires_at,
            CASE WHEN p_status = 'active' THEN NOW() ELSE NULL END
        )
        RETURNING id INTO v_subscription_id;
    END IF;
    
    RETURN jsonb_build_object(
        'success', true,
        'subscription_id', v_subscription_id,
        'message', 'Subscription updated successfully'
    );
EXCEPTION
    WHEN OTHERS THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', SQLERRM
        );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable RLS
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own subscription" ON public.user_subscriptions;
DROP POLICY IF EXISTS "Admins can view all subscriptions" ON public.user_subscriptions;
DROP POLICY IF EXISTS "Admins can insert subscriptions" ON public.user_subscriptions;
DROP POLICY IF EXISTS "Admins can update subscriptions" ON public.user_subscriptions;

-- RLS Policies
-- Users can view their own subscription
CREATE POLICY "Users can view their own subscription"
ON public.user_subscriptions FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Admins can view all subscriptions
CREATE POLICY "Admins can view all subscriptions"
ON public.user_subscriptions FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.user_profiles
        WHERE id = auth.uid() AND role IN ('admin', 'superadmin')
    )
);

-- Admins can insert subscriptions
CREATE POLICY "Admins can insert subscriptions"
ON public.user_subscriptions FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.user_profiles
        WHERE id = auth.uid() AND role IN ('admin', 'superadmin')
    )
);

-- Admins can update subscriptions
CREATE POLICY "Admins can update subscriptions"
ON public.user_subscriptions FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.user_profiles
        WHERE id = auth.uid() AND role IN ('admin', 'superadmin')
    )
);

-- Grant permissions
GRANT SELECT ON public.user_subscriptions TO authenticated;
GRANT INSERT, UPDATE ON public.user_subscriptions TO authenticated;

-- Comments for documentation
COMMENT ON TABLE public.user_subscriptions IS 'Stores user subscription information for access control to guides';
COMMENT ON COLUMN public.user_subscriptions.status IS 'Current status of the subscription: active, expired, cancelled, or pending';
COMMENT ON COLUMN public.user_subscriptions.expires_at IS 'Expiration date of subscription. NULL means lifetime subscription';
COMMENT ON COLUMN public.user_subscriptions.payment_amount IS 'Amount paid in local currency (default BDT)';
COMMENT ON FUNCTION public.has_active_subscription IS 'Checks if a user has an active subscription, automatically expires old subscriptions';
COMMENT ON FUNCTION public.upsert_subscription IS 'Admin function to create or update user subscriptions';
