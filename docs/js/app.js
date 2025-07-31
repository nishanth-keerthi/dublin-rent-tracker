// Load JSON from data/listings.json
async function loadListings() {
  const response = await fetch('data/listings.json');
  const data = await response.json();
  return data;
}

// Filter listings based on form inputs
function filterListings(data, filters) {
  return data.filter(item => {
    const matchMinPrice = !filters.minPrice || item.predicted_rent >= filters.minPrice;
    const matchMaxPrice = !filters.maxPrice || item.predicted_rent <= filters.maxPrice;
    const matchBedrooms = !filters.bedrooms || item.bedrooms == filters.bedrooms;
    const matchBathrooms = !filters.bathrooms || item.bathrooms == filters.bathrooms;
    return matchMinPrice && matchMaxPrice && matchBedrooms && matchBathrooms;
  });
}

// Group by subcode and compute average predicted rent
function groupBySubcode(filteredData) {
  const subcodeGroups = {};

  filteredData.forEach(item => {
    let code = item.dublin_subcode;

    // Clean & validate subcode
    if (typeof code !== "string") code = String(code);
    code = code.trim();

    // Skip bad subcodes
    if (!code || code.toLowerCase() === "nan") return;

    if (!subcodeGroups[code]) {
      subcodeGroups[code] = { count: 0, totalRent: 0 };
    }

    subcodeGroups[code].count += 1;
    subcodeGroups[code].totalRent += item.predicted_rent;
  });

  return Object.entries(subcodeGroups).map(([subcode, stats]) => ({
    subcode,
    averageRent: (stats.totalRent / stats.count).toFixed(2),
    count: stats.count
  })).sort((a, b) => parseFloat(a.averageRent) - parseFloat(b.averageRent));
}

// Render results to table
function renderSubcodeTable(rows) {
  const tbody = document.querySelector('#resultsTable tbody');
  tbody.innerHTML = ""; // Clear existing results

  rows.forEach(row => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${row.subcode}</td>
      <td>€${row.averageRent}</td>
      <td>${row.count}</td>
    `;
    tbody.appendChild(tr);
  });
}

// Main: Runs only on subcode_compare.html
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('compareForm');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const filters = {
        minPrice: parseFloat(document.getElementById('minPrice').value) || null,
        maxPrice: parseFloat(document.getElementById('maxPrice').value) || null,
        bedrooms: parseInt(document.getElementById('bedrooms').value) || null,
        bathrooms: parseInt(document.getElementById('bathrooms').value) || null
      };

      const data = await loadListings();
      const filtered = filterListings(data, filters);
      const grouped = groupBySubcode(filtered);
      renderSubcodeTable(grouped);
    });
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("estimate-form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const subcode = document.getElementById("subcode").value;
    const bedrooms = parseInt(document.getElementById("bedrooms").value);
    const bathrooms = parseInt(document.getElementById("bathrooms").value);

    try {
      const response = await fetch("data/listings.json");
      const listings = await response.json();

      // Filter by subcode
      const subcodeListings = listings.filter(
        (listing) => listing.dublin_subcode == subcode
      );

      if (subcodeListings.length === 0) {
        document.getElementById("result").innerText =
          `No listings found for subcode ${subcode}.`;
        return;
      }

      // Compute average for subcode
      const avgPriceSubcode = subcodeListings.reduce(
        (acc, curr) => acc + curr.monthly_price, 0
      ) / subcodeListings.length;

      // Try to match exact bedroom + bathroom
      const exactMatch = subcodeListings.filter((l) =>
        (!isNaN(bedrooms) ? l.bedrooms == bedrooms : true) &&
        (!isNaN(bathrooms) ? l.bathrooms == bathrooms : true)
      );

      let estimateMsg = `Average rent in Subcode ${subcode}: €${avgPriceSubcode.toFixed(2)}.`;

      if (exactMatch.length > 0) {
        const exactAvg = exactMatch.reduce(
          (acc, curr) => acc + curr.monthly_price, 0
        ) / exactMatch.length;
        estimateMsg += `\n\nEstimated rent for ${bedrooms || "any"} bed / ${bathrooms || "any"} bath: €${exactAvg.toFixed(2)}.`;
      } else {
        estimateMsg += `\n\nNo exact match found for selected rooms.`;
      }

      document.getElementById("result").innerText = estimateMsg;
    } catch (err) {
      console.error("Error loading listings:", err);
      document.getElementById("result").innerText = "Error fetching data.";
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("rank-form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const maxPrice = parseFloat(document.getElementById("maxPrice").value);
    const bedrooms = parseInt(document.getElementById("bedrooms").value);
    const bathrooms = parseInt(document.getElementById("bathrooms").value);
    const subcode = document.getElementById("subcode").value.trim();
    const district = document.getElementById("district").value.trim();

    try {
      const response = await fetch("data/listings.json");
      let listings = await response.json();

      // Remove listings with missing/invalid subcodes
      listings = listings.filter(
        (l) =>
          l.dublin_subcode &&
          l.dublin_subcode.toLowerCase() !== "nan"
      );

      // Apply filters
      if (subcode !== "") {
        listings = listings.filter((l) => String(l.dublin_subcode) === subcode);
      } else if (district !== "") {
        if (district === "North") {
          listings = listings.filter((l) => l.dist_North === true);
        } else if (district === "South") {
          listings = listings.filter((l) => l.dist_South === true);
        }
      }

      // Scoring logic
      const scored = listings.map((l) => {
        let score = 0;

        if (!isNaN(maxPrice)) {
          const price = l.monthly_price;
          if (price <= maxPrice) score += 3;
          else if (price <= maxPrice * 1.1) score += 2;
          else if (price <= maxPrice * 1.2) score += 1;
        }

        if (!isNaN(bedrooms)) {
          const b = parseInt(l.bedrooms);
          if (b === bedrooms) score += 3;
          else if (Math.abs(b - bedrooms) === 1) score += 1;
        }

        if (!isNaN(bathrooms)) {
          const bth = parseInt(l.bathrooms);
          if (bth === bathrooms) score += 3;
          else if (Math.abs(bth - bathrooms) === 1) score += 1;
        }

        if (subcode && l.dublin_subcode == subcode) score += 2;

        return { ...l, score };
      });

      const topListings = scored
        .filter((l) => l.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 10);

      const resultsDiv = document.getElementById("ranked-results");

      if (topListings.length === 0) {
        resultsDiv.innerHTML = "<p>No matching listings found.</p>";
        return;
      }

      let html = "<h2>Top Matching Listings</h2><table><tr><th>Predicted Rent (€)</th><th>Price (€)</th><th>Beds</th><th>Baths</th><th>Subcode</th><th>District</th><th>Score</th><th>Daft.ie Link</th></tr>";
      topListings.forEach((l) => {
        const districtLabel = l.dist_North
          ? "North"
          : l.dist_South
          ? "South"
          : l.dist_Unknown
          ? "Unknown"
          : "Unspecified";

        html += `<tr>
          <td>€${l.predicted_rent.toFixed(0)}</td>
          <td>€${l.monthly_price}</td>
          <td>${l.bedrooms}</td>
          <td>${l.bathrooms}</td>
          <td>${l.dublin_subcode}</td>
          <td>${districtLabel}</td>
          <td>${l.score}</td>
          <td><a href="${l.daft_link}" target="_blank">View Listing</a></td>
        </tr>`;
      });
      html += "</table>";

      resultsDiv.innerHTML = html;
    } catch (err) {
      console.error("Error fetching ranked listings:", err);
      document.getElementById("ranked-results").innerText = "Error fetching listings.";
    }
  });
});
