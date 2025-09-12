-- RPC function for atomically completing check history and resetting product status
CREATE OR REPLACE FUNCTION complete_check_history(
  history_id uuid,
  product_id uuid, 
  completed_by_user uuid,
  completed_at_time timestamp with time zone
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Update check history status
  UPDATE check_history 
  SET 
    status = 'COMPLETED',
    completed_by = completed_by_user,
    completed_at = completed_at_time
  WHERE id = history_id;
  
  -- Reset product check status
  UPDATE products 
  SET check_status = 'NONE'
  WHERE id = product_id;
  
  -- Check if both operations succeeded
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Failed to complete check history or reset product status';
  END IF;
END;
$$;