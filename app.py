import streamlit as st
import requests

# Cinematic Dark Theme CSS
st.markdown("""
    <style>
    .stApp { background-color: #0F172A; color: #F8FAFC; }
    .stButton>button { background-color: #1E293B; border: 1px solid #334155; }
    </style>
""", unsafe_allow_html=True)

st.title("Smart Crop Recommendation")

col1, col2 = st.columns(2)
with col1:
    n = st.number_input("Nitrogen (N)", min_value=0)
    p = st.number_input("Phosphorus (P)", min_value=0)
    k = st.number_input("Potassium (K)", min_value=0)
    ph = st.number_input("Soil pH", min_value=0.0)
with col2:
    temp = st.number_input("Temperature (°C)", min_value=0.0)
    hum = st.number_input("Humidity (%)", min_value=0.0)
    rain = st.number_input("Rainfall (mm)", min_value=0.0)

if st.button("Get Recommendation"):
    payload = {"N": n, "P": p, "K": k, "ph": ph, "temperature": temp, "humidity": hum, "rainfall": rain}
    response = requests.post("http://127.0.0.1:8000/predict", json=payload)
    crop = response.json()["recommended_crop"]
    st.success(f"Recommended Crop: {crop.upper()}")