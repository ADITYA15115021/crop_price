const API_BASE_URL = "http://127.0.0.1:8000/api/v1";

async function request(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json();
}

export async function getStates() {
  return request(`${API_BASE_URL}/states`);
}

export async function getCrops() {
  return request(`${API_BASE_URL}/crops`);
}

export async function getYears() {
  return request(`${API_BASE_URL}/years`);
}

export async function getPrices(filters) {
  const params = new URLSearchParams();

  filters.stateIds.forEach((id) => {
    params.append("state_ids", id);
  });

  filters.cropIds.forEach((id) => {
    params.append("crop_ids", id);
  });

  filters.years.forEach((year) => {
    params.append("years", year);
  });

  params.append("limit", 100);
  params.append("offset", 0);

  return request(
    `${API_BASE_URL}/prices?${params.toString()}`
  );
}

export async function getPriceSummary(filters) {
    const params = new URLSearchParams();
  
    filters.stateIds.forEach((id) => {
      params.append("state_ids", id);
    });
  
    filters.cropIds.forEach((id) => {
      params.append("crop_ids", id);
    });
  
    filters.years.forEach((year) => {
      params.append("years", year);
    });
  
    return request(
      `${API_BASE_URL}/prices/summary?${params.toString()}`
    );
  }


export async function getPriceTrends(filters) {
    const params = new URLSearchParams();
  
    filters.stateIds.forEach((id) => {
      params.append("state_ids", id);
    });
  
    filters.cropIds.forEach((id) => {
      params.append("crop_ids", id);
    });
  
    filters.years.forEach((year) => {
      params.append("years", year);
    });
  
    return request(
      `${API_BASE_URL}/prices/trends?${params.toString()}`
    );
  }