# 1. Manual Dictionary Creation (Simulating an order sent to the market)
trading_order = {
    "id": 849204,
    "symbol": "BTC/USDT",
    "price": 78040.00,
    "quantity": 0.05,
    "status": "open"  # Initial state of the order on the blockchain/exchange
}

print("Initial Order State:")
print(f"Order ID: {trading_order['id']}")
print(f"Symbol: {trading_order['symbol']}")
print(f"Current Status: {trading_order['status']}")
print("-" * 40)

# 2. Strict use of the .get() method to prevent catastrophic crashes (Best practice)
# If the 'fee' key does not exist, the bot assumes 0.0 instead of crashing the script
operation_fee = trading_order.get("fee", 0.0)
print(f"Safety Check (.get): Charged fee = {operation_fee}")

# 3. State Transition: Changing the status from "open" to "executed"
# We simulate that the market price has reached our target
trading_order["status"] = "executed"

print("-" * 40)
print("EVENT: The target price was reached in the market!")
print(f"New Order Status updated in the dictionary: {trading_order['status']}")
