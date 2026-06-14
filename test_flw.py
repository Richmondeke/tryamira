import json
import urllib.request
import urllib.parse

client_id = "3a253ee0-83ee-41ff-9453-f3ccc2db8e4c"
client_secret = "4II0TEj4lJrIDkAiETc4NxpB7TZ8lRkW"

# Step 1: Get Access Token
token_url = "https://idp.flutterwave.com/realms/flutterwave/protocol/openid-connect/token"
token_data = urllib.parse.urlencode({
    "client_id": client_id,
    "client_secret": client_secret,
    "grant_type": "client_credentials"
}).encode("utf-8")

req = urllib.request.Request(token_url, data=token_data, headers={
    "Content-Type": "application/x-www-form-urlencoded"
})

try:
    with urllib.request.urlopen(req) as res:
        token_res = json.loads(res.read().decode())
        access_token = token_res["access_token"]
        print("Successfully obtained access token!")
except Exception as e:
    print("Failed to get token:", e)
    exit(1)

# Step 2: Try creating a charge
charge_url = "https://f4bexperience.flutterwave.com/v4/charges"
charge_payload = {
    "amount": 2000,
    "currency": "NGN",
    "payment_method": "card", # Try card/standard
    "customer": {
        "email": "test-user@heyamira.com",
        "name": "Amira Test User"
    },
    "redirect_url": "https://heyamira.com/callback",
    "tx_ref": "test_ref_12345"
}

req_charge = urllib.request.Request(charge_url, data=json.dumps(charge_payload).encode("utf-8"), headers={
    "Authorization": f"Bearer {access_token}",
    "Content-Type": "application/json",
    "X-Idempotency-Key": "test_idem_12345"
})

try:
    with urllib.request.urlopen(req_charge) as res:
        print("Charge status code:", res.status)
        print("Charge response:", res.read().decode())
except urllib.error.HTTPError as e:
    print("HTTPError:", e.code)
    print(e.read().decode())
except Exception as e:
    print("Error during charge:", e)
