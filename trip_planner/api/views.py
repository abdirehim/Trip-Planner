
# from rest_framework.views import APIView
# from rest_framework.response import Response
# import requests
# from .serializers import TripInputSerializer

# # Replace with your ORS API key from openrouteservice.org
# ORS_API_KEY ="5b3ce3597851110001cf6248490ad3ae81024db18fa187b2ae1282d9"

# class TripPlannerView(APIView):
#     # HOS Constants (defined at class level)
#     AVG_SPEED = 60  # mph
#     DAILY_DRIVING_LIMIT = 11  # hours
#     DAILY_ON_DUTY_LIMIT = 14  # hours
#     BREAK_DURATION = 0.5  # 30-minute break
#     FUELING_INTERVAL = 1000  # miles
#     FUELING_TIME = 0.5  # hours per stop
#     REST_DURATION = 10  # hours
#     PICKUP_DROP_OFF_TIME = 1  # hour each
#     BREAK_TRIGGER = 8  # hours of driving before 30-min break
#     CYCLE_LIMIT = 70  # hours in 8 days

#     def post(self, request):
#         serializer = TripInputSerializer(data=request.data)
#         if serializer.is_valid():
#             current_loc = serializer.validated_data['current_location']
#             pickup_loc = serializer.validated_data['pickup_location']
#             dropoff_loc = serializer.validated_data['dropoff_location']
#             cycle_used = serializer.validated_data['current_cycle_used']

#             # Geocode locations
#             coords = {
#                 'current': self.geocode(current_loc),
#                 'pickup': self.geocode(pickup_loc),
#                 'dropoff': self.geocode(dropoff_loc)
#             }

#             # Get route
#             route = self.get_route(coords)
#             distance_miles = route['features'][0]['properties']['summary']['distance'] / 1609.34  # Meters to miles

#             # Plan trip and generate logs
#             trip_plan = self.plan_trip(distance_miles, cycle_used)

#             return Response({
#                 'route': route,
#                 'log_sheets': trip_plan['log_sheets'],
#                 'fueling_stops': trip_plan['fueling_stops'],
#                 'total_distance': distance_miles
#             })
#         return Response(serializer.errors, status=400)

#     def geocode(self, location):
#         """Geocode a location string to coordinates using OpenRouteService."""
#         url = f"https://api.openrouteservice.org/geocode/search?api_key={ORS_API_KEY}&text={location}"
#         response = requests.get(url)
#         if response.status_code == 200:
#             data = response.json()
#             if 'features' in data and len(data['features']) > 0:
#                 coords = data['features'][0]['geometry']['coordinates']
#                 return [coords[0], coords[1]]  # [longitude, latitude]
#             raise ValueError(f"No geocoding results for {location}")
#         elif response.status_code == 401:
#             raise ValueError(f"Unauthorized: Invalid ORS API key for {location}")
#         else:
#             raise ValueError(f"Geocoding failed for {location} (Status: {response.status_code})")

#     def get_route(self, coords):
#         """Get driving route using OpenRouteService."""
#         url = "https://api.openrouteservice.org/v2/directions/driving-car/geojson"
#         body = {
#             "coordinates": [
#                 coords['current'],
#                 coords['pickup'],
#                 coords['dropoff']
#             ]
#         }
#         headers = {"Authorization": ORS_API_KEY}
#         response = requests.post(url, json=body, headers=headers)
#         if response.status_code == 200:
#             return response.json()
#         raise ValueError(f"Routing failed (Status: {response.status_code})")

#     def plan_trip(self, distance, cycle_used):
#         remaining_distance = distance
#         remaining_cycle = self.CYCLE_LIMIT - cycle_used
#         day = 1
#         log_sheets = []
#         current_position = 0
#         total_distance_traveled = 0
#         fueling_stops = []

#         while remaining_distance > 0:
#             driving_hours = 0
#             on_duty_hours = self.PICKUP_DROP_OFF_TIME if day == 1 else 0
#             cumulative_driving = 0
#             daily_fueling_stops = 0

#             # Drive until daily limits are reached
#             while (driving_hours < self.DAILY_DRIVING_LIMIT and 
#                    on_duty_hours < self.DAILY_ON_DUTY_LIMIT and 
#                    on_duty_hours < remaining_cycle and 
#                    remaining_distance > 0):
#                 # Add 30-minute break after 8 hours of driving
#                 if cumulative_driving >= self.BREAK_TRIGGER:
#                     on_duty_hours += self.BREAK_DURATION
#                     cumulative_driving = 0

#                 driving_segment = min(
#                     self.DAILY_DRIVING_LIMIT - driving_hours,
#                     self.DAILY_ON_DUTY_LIMIT - on_duty_hours,
#                     remaining_cycle - on_duty_hours,
#                     remaining_distance / self.AVG_SPEED
#                 )
#                 distance_covered = driving_segment * self.AVG_SPEED
#                 total_distance_traveled += distance_covered
#                 new_position = current_position + distance_covered
                
#                 # Add fueling stops based on total distance
#                 new_fueling_stops = max(0, int(total_distance_traveled / self.FUELING_INTERVAL) - 
#                                         int((total_distance_traveled - distance_covered) / self.FUELING_INTERVAL))
#                 daily_fueling_stops += new_fueling_stops
#                 if new_fueling_stops > 0:
#                     for i in range(new_fueling_stops):
#                         fueling_distance = total_distance_traveled - (i * self.FUELING_INTERVAL)
#                         fueling_stops.append({
#                             'distance': fueling_distance,
#                             'day': day
#                         })
                
#                 on_duty_hours += driving_segment + (new_fueling_stops * self.FUELING_TIME)
#                 driving_hours += driving_segment
#                 cumulative_driving += driving_segment
#                 current_position = new_position
#                 remaining_distance -= distance_covered

#             # Add drop-off time on the last day
#             if remaining_distance <= 0:
#                 on_duty_hours += self.PICKUP_DROP_OFF_TIME

#             log = self.generate_log_sheet(day, driving_hours, on_duty_hours, daily_fueling_stops, remaining_distance <= 0)
#             log_sheets.append(log)

#             remaining_cycle -= on_duty_hours
#             day += 1

#             if remaining_cycle <= 0:
#                 return Response({"error": "Insufficient cycle hours remaining"}, status=400)

#         return {
#             'log_sheets': log_sheets,
#             'fueling_stops': fueling_stops
#         }

#     def generate_log_sheet(self, day, driving_hours, on_duty_hours, fueling_stops, is_last_day):
#         """Generate a 24-hour log sheet with duty statuses."""
#         log = ['OFF'] * 24
#         current_hour = 0

#         # Pickup (Day 1 only)
#         if day == 1:
#             for h in range(int(self.PICKUP_DROP_OFF_TIME)):
#                 if current_hour + h < 24:
#                     log[current_hour + h] = 'ON'
#             current_hour += int(self.PICKUP_DROP_OFF_TIME)

#         # Driving with breaks
#         driving_logged = 0
#         while driving_logged < driving_hours and current_hour < 24:
#             if driving_logged >= self.BREAK_TRIGGER:
#                 for h in range(int(self.BREAK_DURATION * 2)):
#                     if current_hour + h < 24:
#                         log[current_hour + h] = 'SB'
#                 current_hour += int(self.BREAK_DURATION * 2)
#                 driving_logged = self.BREAK_TRIGGER
#             segment = min(self.BREAK_TRIGGER - (driving_logged % self.BREAK_TRIGGER), driving_hours - driving_logged)
#             for h in range(int(segment)):
#                 if current_hour + h < 24:
#                     log[current_hour + h] = 'D'
#             current_hour += int(segment)
#             driving_logged += segment

#         # Fueling stops
#         for _ in range(fueling_stops):
#             if current_hour < 24:
#                 log[current_hour] = 'ON'
#                 current_hour += 1

#         # Drop-off (last day)
#         if is_last_day:
#             for h in range(int(self.PICKUP_DROP_OFF_TIME)):
#                 if current_hour + h < 24:
#                     log[current_hour + h] = 'ON'
#             current_hour += int(self.PICKUP_DROP_OFF_TIME)

#         # Ensure 10-hour rest
#         rest_hours = min(self.REST_DURATION, 24 - current_hour)
#         for h in range(rest_hours):
#             if current_hour + h < 24:
#                 log[current_hour + h] = 'SB'
#         current_hour += rest_hours

#         return {'day': day, 'log': log}
from rest_framework.views import APIView
from rest_framework.response import Response
import requests
from .serializers import TripInputSerializer

# Replace with your ORS API key from openrouteservice.org
ORS_API_KEY = "5b3ce3597851110001cf6248490ad3ae81024db18fa187b2ae1282d9"

class TripPlannerView(APIView):
    # HOS Constants (defined at class level)
    AVG_SPEED = 60  # mph
    DAILY_DRIVING_LIMIT = 11  # hours
    DAILY_ON_DUTY_LIMIT = 14  # hours
    BREAK_DURATION = 0.5  # 30-minute break
    FUELING_INTERVAL = 1000  # miles
    FUELING_TIME = 0.5  # hours per stop
    REST_DURATION = 10  # hours
    PICKUP_DROP_OFF_TIME = 1  # hour each
    BREAK_TRIGGER = 8  # hours of driving before 30-min break
    CYCLE_LIMIT = 70  # hours in 8 days

    def post(self, request):
        serializer = TripInputSerializer(data=request.data)
        if serializer.is_valid():
            current_loc = serializer.validated_data['current_location']
            pickup_loc = serializer.validated_data['pickup_location']
            dropoff_loc = serializer.validated_data['dropoff_location']
            cycle_used = serializer.validated_data['current_cycle_used']

            # Geocode locations
            coords = {
                'current': self.geocode(current_loc),
                'pickup': self.geocode(pickup_loc),
                'dropoff': self.geocode(dropoff_loc)
            }

            # Get route
            route = self.get_route(coords)
            distance_miles = route['features'][0]['properties']['summary']['distance'] / 1609.34  # Meters to miles

            # Plan trip and generate logs
            trip_plan = self.plan_trip(distance_miles, cycle_used)

            return Response({
                'route': route,
                'log_sheets': trip_plan['log_sheets'],
                'fueling_stops': trip_plan['fueling_stops'],
                'total_distance': distance_miles
            })
        return Response(serializer.errors, status=400)

    def geocode(self, location):
        """Geocode a location string to coordinates using OpenRouteService."""
        url = f"https://api.openrouteservice.org/geocode/search?api_key={ORS_API_KEY}&text={location}"
        response = requests.get(url)
        if response.status_code == 200:
            data = response.json()
            if 'features' in data and len(data['features']) > 0:
                coords = data['features'][0]['geometry']['coordinates']
                return [coords[0], coords[1]]  # [longitude, latitude]
            raise ValueError(f"No geocoding results for {location}")
        elif response.status_code == 401:
            raise ValueError(f"Unauthorized: Invalid ORS API key for {location}")
        else:
            raise ValueError(f"Geocoding failed for {location} (Status: {response.status_code})")

    def get_route(self, coords):
        """Get driving route using OpenRouteService."""
        url = "https://api.openrouteservice.org/v2/directions/driving-car/geojson"
        body = {
            "coordinates": [
                coords['current'],
                coords['pickup'],
                coords['dropoff']
            ]
        }
        headers = {"Authorization": ORS_API_KEY}
        response = requests.post(url, json=body, headers=headers)
        if response.status_code == 200:
            return response.json()
        raise ValueError(f"Routing failed (Status: {response.status_code})")

    def plan_trip(self, distance, cycle_used):
        remaining_distance = distance
        remaining_cycle = self.CYCLE_LIMIT - cycle_used
        day = 1
        log_sheets = []
        current_position = 0
        total_distance_traveled = 0
        fueling_stops = []

        while remaining_distance > 0:
            driving_hours = 0
            on_duty_hours = self.PICKUP_DROP_OFF_TIME if day == 1 else 0
            cumulative_driving = 0
            daily_fueling_stops = 0

            while (driving_hours < self.DAILY_DRIVING_LIMIT and 
                   on_duty_hours < self.DAILY_ON_DUTY_LIMIT and 
                   on_duty_hours < remaining_cycle and 
                   remaining_distance > 0):
                if cumulative_driving >= self.BREAK_TRIGGER:
                    on_duty_hours += self.BREAK_DURATION
                    cumulative_driving = 0

                driving_segment = min(
                    self.DAILY_DRIVING_LIMIT - driving_hours,
                    self.DAILY_ON_DUTY_LIMIT - on_duty_hours,
                    remaining_cycle - on_duty_hours,
                    remaining_distance / self.AVG_SPEED
                )
                distance_covered = driving_segment * self.AVG_SPEED
                total_distance_traveled += distance_covered
                new_position = current_position + distance_covered
                
                new_fueling_stops = max(0, int(total_distance_traveled / self.FUELING_INTERVAL) - 
                                        int((total_distance_traveled - distance_covered) / self.FUELING_INTERVAL))
                daily_fueling_stops += new_fueling_stops
                if new_fueling_stops > 0:
                    for i in range(new_fueling_stops):
                        fueling_distance = total_distance_traveled - (i * self.FUELING_INTERVAL)
                        fueling_stops.append({
                            'distance': fueling_distance,
                            'day': day
                        })
                
                on_duty_hours += driving_segment + (new_fueling_stops * self.FUELING_TIME)
                driving_hours += driving_segment
                cumulative_driving += driving_segment
                current_position = new_position
                remaining_distance -= distance_covered

            if remaining_distance <= 0:
                on_duty_hours += self.PICKUP_DROP_OFF_TIME

            log = self.generate_log_sheet(day, driving_hours, on_duty_hours, daily_fueling_stops, remaining_distance <= 0)
            log_sheets.append(log)

            remaining_cycle -= on_duty_hours
            day += 1

            if remaining_cycle <= 0:
                return Response({"error": "Insufficient cycle hours remaining"}, status=400)

        return {
            'log_sheets': log_sheets,
            'fueling_stops': fueling_stops
        }

    def generate_log_sheet(self, day, driving_hours, on_duty_hours, fueling_stops, is_last_day):
        """Generate a 24-hour log sheet with duty statuses."""
        log = ['OFF'] * 24
        current_hour = 0

        # Pickup (Day 1 only)
        if day == 1:
            for h in range(int(self.PICKUP_DROP_OFF_TIME)):
                if current_hour + h < 24:
                    log[current_hour + h] = 'ON'
            current_hour += int(self.PICKUP_DROP_OFF_TIME)

        # Driving with breaks
        driving_logged = 0
        while driving_logged < driving_hours and current_hour < 24:
            if driving_logged >= self.BREAK_TRIGGER:
                for h in range(int(self.BREAK_DURATION * 2)):
                    if current_hour + h < 24:
                        log[current_hour + h] = 'SB'
                current_hour += int(self.BREAK_DURATION * 2)
                driving_logged = self.BREAK_TRIGGER
            segment = min(
                self.DAILY_DRIVING_LIMIT - driving_logged,
                self.BREAK_TRIGGER - (driving_logged % self.BREAK_TRIGGER),
                driving_hours - driving_logged
            )
            for h in range(int(segment)):
                if current_hour + h < 24:
                    log[current_hour + h] = 'D'
            current_hour += int(segment)
            driving_logged += segment

        # Fueling stops
        for _ in range(fueling_stops):
            if current_hour < 24:
                log[current_hour] = 'ON'
                current_hour += 1

        # Drop-off (last day)
        if is_last_day:
            for h in range(int(self.PICKUP_DROP_OFF_TIME)):
                if current_hour + h < 24:
                    log[current_hour + h] = 'ON'
            current_hour += int(self.PICKUP_DROP_OFF_TIME)

        # Ensure 10-hour rest
        rest_hours = min(self.REST_DURATION, 24 - current_hour)
        for h in range(rest_hours):
            if current_hour + h < 24:
                log[current_hour + h] = 'SB'
        current_hour += rest_hours

        return {'day': day, 'log': log}