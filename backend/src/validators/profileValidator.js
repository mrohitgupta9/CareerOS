const WORK_MODES = ["onsite", "hybrid", "remote", "any"];

const EMPLOYMENT_TYPES = [
  "full-time",
  "part-time",
  "contract",
  "internship",
  "any",
];

// =====================================================
// HELPERS
// =====================================================

const isObject = (value) =>
  value !== null &&
  typeof value === "object" &&
  !Array.isArray(value);

const cleanString = (value) =>
  typeof value === "string" ? value.trim() : value;

const cleanStringArray = (value) =>
  Array.isArray(value)
    ? value
        .filter((item) => typeof item === "string")
        .map((item) => item.trim())
        .filter(Boolean)
    : value;

// =====================================================
// MAIN VALIDATOR
// =====================================================

const validateProfileInput = (input = {}) => {
  if (!isObject(input)) {
    return {
      valid: false,
      errors: ["Profile data must be an object"],
    };
  }

  const errors = [];

  // ===================================================
  // BASIC PROFILE FIELDS
  // ===================================================

  let phone = cleanString(input.phone);
  let headline = cleanString(input.headline);
  let bio = cleanString(input.bio);

  if (phone !== undefined && typeof phone !== "string") {
    errors.push("Phone must be a string");
  } else if (typeof phone === "string" && phone.length > 30) {
    errors.push("Phone cannot exceed 30 characters");
  }

  if (headline !== undefined && typeof headline !== "string") {
    errors.push("Headline must be a string");
  } else if (typeof headline === "string" && headline.length > 160) {
    errors.push("Headline cannot exceed 160 characters");
  }

  if (bio !== undefined && typeof bio !== "string") {
    errors.push("Bio must be a string");
  } else if (typeof bio === "string" && bio.length > 2000) {
    errors.push("Bio cannot exceed 2000 characters");
  }

  // ===================================================
  // LOCATION
  // ===================================================

  let location = input.location;

  if (location !== undefined) {
    if (!isObject(location)) {
      errors.push("Location must be an object");
    } else {
      location = {
        city: cleanString(location.city ?? ""),
        state: cleanString(location.state ?? ""),
        country: cleanString(location.country ?? ""),
      };

      for (const field of ["city", "state", "country"]) {
        if (typeof location[field] !== "string") {
          errors.push(`Location ${field} must be a string`);
        } else if (location[field].length > 100) {
          errors.push(`Location ${field} cannot exceed 100 characters`);
        }
      }
    }
  }

  // ===================================================
  // SKILLS
  // ===================================================

  let skills = input.skills;

  if (skills !== undefined) {
    if (!Array.isArray(skills)) {
      errors.push("Skills must be an array");
    } else {
      skills = cleanStringArray(skills);

      if (skills.length > 50) {
        errors.push("Skills cannot contain more than 50 items");
      }

      skills.forEach((skill) => {
        if (skill.length > 100) {
          errors.push("Each skill cannot exceed 100 characters");
        }
      });

      // Remove duplicate skills while preserving order
      skills = [...new Set(skills)];
    }
  }

  // ===================================================
  // EDUCATION
  // ===================================================

  let education = input.education;

  if (education !== undefined) {
    if (!Array.isArray(education)) {
      errors.push("Education must be an array");
    } else {
      if (education.length > 20) {
        errors.push("Education cannot contain more than 20 entries");
      }

      education = education.map((item, index) => {
        if (!isObject(item)) {
          errors.push(`Education entry ${index + 1} must be an object`);
          return item;
        }

        const entry = {
          institution: cleanString(item.institution ?? ""),
          degree: cleanString(item.degree ?? ""),
          fieldOfStudy: cleanString(item.fieldOfStudy ?? ""),
          startYear: item.startYear,
          endYear: item.endYear,
          grade: cleanString(item.grade ?? ""),
        };

        // -----------------------------------------------
        // String fields
        // -----------------------------------------------

        const stringLimits = {
          institution: 150,
          degree: 100,
          fieldOfStudy: 120,
          grade: 50,
        };

        for (const [field, maxLength] of Object.entries(stringLimits)) {
          if (typeof entry[field] !== "string") {
            errors.push(
              `Education ${field} at entry ${index + 1} must be a string`
            );
          } else if (entry[field].length > maxLength) {
            errors.push(
              `Education ${field} at entry ${index + 1} cannot exceed ${maxLength} characters`
            );
          }
        }

        // -----------------------------------------------
        // Years
        // -----------------------------------------------

        if (entry.startYear !== undefined && entry.startYear !== null) {
          if (
            !Number.isInteger(entry.startYear) ||
            entry.startYear < 1950 ||
            entry.startYear > 2100
          ) {
            errors.push(
              `Education startYear at entry ${index + 1} must be between 1950 and 2100`
            );
          }
        }

        if (entry.endYear !== undefined && entry.endYear !== null) {
          if (
            !Number.isInteger(entry.endYear) ||
            entry.endYear < 1950 ||
            entry.endYear > 2100
          ) {
            errors.push(
              `Education endYear at entry ${index + 1} must be between 1950 and 2100`
            );
          }
        }

        // -----------------------------------------------
        // Cross-field validation
        // -----------------------------------------------

        if (
          Number.isInteger(entry.startYear) &&
          Number.isInteger(entry.endYear) &&
          entry.endYear < entry.startYear
        ) {
          errors.push(
            `Education endYear cannot be before startYear at entry ${
              index + 1
            }`
          );
        }

        return entry;
      });
    }
  }

  // ===================================================
  // EXPERIENCE
  // ===================================================

  let experience = input.experience;

  if (experience !== undefined) {
    if (!Array.isArray(experience)) {
      errors.push("Experience must be an array");
    } else {
      if (experience.length > 30) {
        errors.push("Experience cannot contain more than 30 entries");
      }

      experience = experience.map((item, index) => {
        if (!isObject(item)) {
          errors.push(`Experience entry ${index + 1} must be an object`);
          return item;
        }

        const entry = {
          company: cleanString(item.company ?? ""),
          jobTitle: cleanString(item.jobTitle ?? ""),
          location: cleanString(item.location ?? ""),
          startDate: item.startDate,
          endDate:
            item.endDate === undefined ? null : item.endDate,
          isCurrent:
            item.isCurrent === undefined ? false : item.isCurrent,
          description: cleanString(item.description ?? ""),
        };

        // -----------------------------------------------
        // String fields
        // -----------------------------------------------

        const stringLimits = {
          company: 150,
          jobTitle: 120,
          location: 120,
          description: 2000,
        };

        for (const [field, maxLength] of Object.entries(stringLimits)) {
          if (typeof entry[field] !== "string") {
            errors.push(
              `Experience ${field} at entry ${index + 1} must be a string`
            );
          } else if (entry[field].length > maxLength) {
            errors.push(
              `Experience ${field} at entry ${index + 1} cannot exceed ${maxLength} characters`
            );
          }
        }

        // -----------------------------------------------
        // isCurrent validation
        // -----------------------------------------------

        if (typeof entry.isCurrent !== "boolean") {
          errors.push(
            `Experience isCurrent at entry ${index + 1} must be a boolean`
          );
        }

        // -----------------------------------------------
        // Date validation
        // -----------------------------------------------

        let startDate = null;
        let endDate = null;

        if (entry.startDate !== undefined && entry.startDate !== null) {
          startDate = new Date(entry.startDate);

          if (Number.isNaN(startDate.getTime())) {
            errors.push(
              `Experience startDate at entry ${index + 1} must be a valid date`
            );
          }
        }

        if (entry.endDate !== undefined && entry.endDate !== null) {
          endDate = new Date(entry.endDate);

          if (Number.isNaN(endDate.getTime())) {
            errors.push(
              `Experience endDate at entry ${index + 1} must be a valid date`
            );
          }
        }

        // -----------------------------------------------
        // Current job consistency
        // -----------------------------------------------

        if (entry.isCurrent === true && entry.endDate !== null) {
          errors.push(
            `Experience endDate must be null when isCurrent is true at entry ${
              index + 1
            }`
          );
        }

        if (entry.isCurrent === false && entry.endDate === null) {
          errors.push(
            `Experience endDate is required when isCurrent is false at entry ${
              index + 1
            }`
          );
        }

        // -----------------------------------------------
        // Date order
        // -----------------------------------------------

        if (
          startDate &&
          !Number.isNaN(startDate.getTime()) &&
          endDate &&
          !Number.isNaN(endDate.getTime()) &&
          endDate < startDate
        ) {
          errors.push(
            `Experience endDate cannot be before startDate at entry ${
              index + 1
            }`
          );
        }

        return entry;
      });
    }
  }

  // ===================================================
  // CAREER PREFERENCES
  // ===================================================

  let careerPreferences = input.careerPreferences;

  if (careerPreferences !== undefined) {
    if (!isObject(careerPreferences)) {
      errors.push("Career preferences must be an object");
    } else {
      let preferredRoles = careerPreferences.preferredRoles;
      let preferredLocations = careerPreferences.preferredLocations;

      if (preferredRoles !== undefined) {
        if (!Array.isArray(preferredRoles)) {
          errors.push("Preferred roles must be an array");
        } else {
          preferredRoles = cleanStringArray(preferredRoles);

          if (preferredRoles.length > 20) {
            errors.push(
              "Preferred roles cannot contain more than 20 items"
            );
          }

          preferredRoles = [...new Set(preferredRoles)];
        }
      }

      if (preferredLocations !== undefined) {
        if (!Array.isArray(preferredLocations)) {
          errors.push("Preferred locations must be an array");
        } else {
          preferredLocations = cleanStringArray(preferredLocations);

          if (preferredLocations.length > 20) {
            errors.push(
              "Preferred locations cannot contain more than 20 items"
            );
          }

          preferredLocations = [...new Set(preferredLocations)];
        }
      }

      const workMode =
        careerPreferences.workMode === undefined
          ? "any"
          : careerPreferences.workMode;

      const employmentType =
        careerPreferences.employmentType === undefined
          ? "any"
          : careerPreferences.employmentType;

      const expectedSalary =
        careerPreferences.expectedSalary === undefined
          ? null
          : careerPreferences.expectedSalary;

      if (!WORK_MODES.includes(workMode)) {
        errors.push("Invalid work mode");
      }

      if (!EMPLOYMENT_TYPES.includes(employmentType)) {
        errors.push("Invalid employment type");
      }

      if (
        expectedSalary !== null &&
        (typeof expectedSalary !== "number" ||
          !Number.isFinite(expectedSalary) ||
          expectedSalary < 0)
      ) {
        errors.push("Expected salary must be a valid non-negative number");
      }

      careerPreferences = {
        preferredRoles:
          preferredRoles === undefined ? [] : preferredRoles,
        preferredLocations:
          preferredLocations === undefined ? [] : preferredLocations,
        workMode,
        employmentType,
        expectedSalary,
      };
    }
  }

  // ===================================================
  // RETURN VALIDATION RESULT
  // ===================================================

  if (errors.length > 0) {
    return {
      valid: false,
      errors,
    };
  }

  return {
    valid: true,
    data: {
      phone: phone ?? "",
      location: location ?? {
        city: "",
        state: "",
        country: "",
      },
      headline: headline ?? "",
      bio: bio ?? "",
      skills: skills ?? [],
      education: education ?? [],
      experience: experience ?? [],
      careerPreferences: careerPreferences ?? {
        preferredRoles: [],
        preferredLocations: [],
        workMode: "any",
        employmentType: "any",
        expectedSalary: null,
      },
    },
  };
};

module.exports = {
  validateProfileInput,
};