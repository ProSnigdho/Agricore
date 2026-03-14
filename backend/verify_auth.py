import requests
import sys

BASE_URL = "http://127.0.0.1:8000/api/auth/"

def test_registration():
    print("Testing Registration...")
    data = {
        "username": "testuser_verification_3",
        "email": "test_3@example.com",
        "password": "testpassword123",
        "first_name": "Test",
        "last_name": "User"
    }
    response = requests.post(f"{BASE_URL}register/", json=data)
    if response.status_code == 201:
        print("Registration Successful!")
        return response.json()
    else:
        print(f"Registration Failed: {response.text}")
        return None

def test_login():
    print("Testing Login...")
    data = {
        "username": "testuser_verification_3",
        "password": "testpassword123"
    }
    response = requests.post(f"{BASE_URL}login/", json=data)
    if response.status_code == 200:
        print("Login Successful!")
        return response.json()
    else:
        print(f"Login Failed: {response.text}")
        return None

def test_profile(access_token):
    print("Testing Profile Access...")
    headers = {"Authorization": f"Bearer {access_token}"}
    response = requests.get(f"{BASE_URL}profile/", headers=headers)
    if response.status_code == 200:
        print(f"Profile Access Successful! Role: {response.json().get('role')}")
    else:
        print(f"Profile Access Failed: {response.text}")

if __name__ == "__main__":
    reg_data = test_registration()
    if reg_data:
        login_data = test_login()
        if login_data:
            test_profile(login_data['access'])
