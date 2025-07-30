import time
import numpy as np

print("Importing necessary libraries...")

start_time = time.time()

import pyart
from process import save_radar_data_for_js

print(f"Imports completed in {time.time() - start_time:.2f} seconds.")

print("Loading radar data from file...")

start_time = time.time()
radar_file = "src_data/KFTG20250724_163608_V06"
radar = pyart.io.read_nexrad_archive(radar_file)

radar_ds = radar.fields['reflectivity']['data']
azimuths = radar.azimuth['data']

print(f"Radar data loaded in {time.time() - start_time:.2f} seconds.")

print("Converting radar data for WebGL...")
start_time = time.time()
converted = save_radar_data_for_js(radar_ds, azimuths)
print(f"Conversion completed in {time.time() - start_time:.2f} seconds.")