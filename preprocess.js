const fs = require("fs");
const baseProjects = require("./data/projects.json");

function assignLayers(ranges) {
  // First, sort ranges by duration (longest first)
  const rangesWithDuration = ranges.map((range) => {
    const endDate = range.endDate === "Present" ? Date.now() : range.endDate;
    const duration = endDate - range.startDate;

    return {
      ...range,
      duration,
      endDate:
        duration > 1000 * 60 * 60 * 24 * 7
          ? range.endDate
          : range.startDate + 1000 * 60 * 60 * 24 * 7,
    };
  });

  rangesWithDuration.sort((a, b) => b.duration - a.duration);

  // Initialize result array with the first (longest) range at layer 0
  const result = [
    {
      ...rangesWithDuration[0],
      layer: 0,
    },
  ];

  // For each remaining range
  for (let i = 1; i < rangesWithDuration.length; i++) {
    const currentRange = rangesWithDuration[i];
    let layer = 0;
    let foundSpot = false;

    // Keep trying higher layers until we find a spot where the range doesn't overlap
    while (!foundSpot) {
      // Check if current layer works by checking against all ranges in that layer
      const rangesInLayer = result.filter((r) => r.layer === layer);
      const hasOverlap = rangesInLayer.some(
        (r) =>
          !(
            currentRange.endDate <= r.startDate ||
            currentRange.startDate >= r.endDate
          ),
      );

      if (!hasOverlap) {
        // We found a valid layer
        foundSpot = true;
      } else {
        // Try next layer up
        layer++;
      }
    }

    // Add the range with its assigned layer
    result.push({
      ...currentRange,
      layer,
    });
  }

  return result;
}

const outProjects = assignLayers(baseProjects);

fs.writeFileSync("./src/_data.json", JSON.stringify(outProjects, null, 2));
