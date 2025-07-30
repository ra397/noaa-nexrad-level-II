import numpy as np
import json

def convert_radar_data_for_webgl(radar_ds, azimuths, max_gates=920, target_rays=720):
    """
    Vectorized conversion of radar data for WebGL.
    """
    # 1) Truncate gates
    n_rays, n_gates = radar_ds.shape
    actual_gates = min(n_gates, max_gates)
    radar_data = radar_ds[:, :actual_gates].astype(np.float32)

    # 2) Compute target azimuths and bin index per ray
    beam_width = 360.0 / target_rays
    # shift by half-beam so bins are centered
    bin_idx = np.floor((azimuths + beam_width/2) / beam_width).astype(int) % target_rays

    # 3) Binned max per gate per bin
    binned_data = np.zeros((target_rays, actual_gates), dtype=np.float32)
    for i in range(target_rays):
        mask = (bin_idx == i)
        if not mask.any():
            continue
        # max over all rays in this bin, for each gate
        binned_data[i, :] = radar_data[mask, :].max(axis=0)

    # 4) Build vertex arrays via meshgrid
    # distances (0 … actual_gates)*250m
    unit_scale = 1000.0  # km→m
    gate_km = 0.25       # 250 m
    gates = np.arange(actual_gates + 1) * gate_km * unit_scale
    rays = (np.arange(target_rays + 1) * beam_width) - (beam_width/2)

    az_mesh, dist_mesh = np.meshgrid(rays, gates, indexing='ij')
    azimuths_array = az_mesh.ravel().astype(np.float32)
    distances_array = dist_mesh.ravel().astype(np.float32)

    # 5) Color indices: normalize to 0–254, pad last row/col with zeros
    max_intensity = binned_data.max() or 1.0
    scale = 254.0 / max_intensity
    normed = np.clip((binned_data * scale).round(), 0, 254).astype(np.uint8)
    color_grid = np.zeros((target_rays + 1, actual_gates + 1), dtype=np.uint8)
    color_grid[:target_rays, :actual_gates] = normed
    color_indices = color_grid.ravel()

    # 6) Triangle indices via vectorized indexing
    r = target_rays
    g = actual_gates
    # base corner indices for each quad
    base = (np.arange(r)[:, None] * (g + 1)) + np.arange(g)
    bA0 = base
    tA0 = base + 1
    bA1 = base + (g + 1)
    tA1 = bA1 + 1

    tris = np.stack([bA0, tA0, bA1, tA0, tA1, bA1], axis=2)
    triangle_indices = tris.reshape(-1).tolist()

    return {
        'azimuths':     azimuths_array.tolist(),
        'distances':    distances_array.tolist(),
        'colorIndices': color_indices.tolist(),
        'triangleIndices': triangle_indices,
        'metadata': {
            'nRays':      target_rays,
            'nGates':     actual_gates,
            'gateLength': gate_km,
            'beamWidth':  beam_width,
            'nVertices':  azimuths_array.size,
            'nTriangles': len(triangle_indices) // 3
        }
    }

def save_radar_data_for_js(radar_ds, azimuths, output_file='radar_data.json', **kwargs):
    """
    Convert + dump to compact JSON.
    """
    data = convert_radar_data_for_webgl(radar_ds, azimuths, **kwargs)
    with open(output_file, 'w') as f:
        json.dump(data, f, separators=(',',':'))
    size_mb = len(json.dumps(data)) / (1024**2)
    print(f"Saved {output_file} ({size_mb:.2f} MB)")
    return data