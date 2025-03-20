# api/serializers.py
from rest_framework import serializers

class TripInputSerializer(serializers.Serializer):
    current_location = serializers.CharField(max_length=100)  # e.g., "New York, NY"
    pickup_location = serializers.CharField(max_length=100)
    dropoff_location = serializers.CharField(max_length=100)
    current_cycle_used = serializers.FloatField(min_value=0, max_value=70)