import pyart

radar_file = "KFTG20250722_235527_V06"
radar = pyart.io.read_nexrad_archive(radar_file)

radar_ds = radar.fields['reflectivity']['data']
azimuths = radar.azimuth['data']

print(radar_ds.shape)
print(min(azimuths), max(azimuths))