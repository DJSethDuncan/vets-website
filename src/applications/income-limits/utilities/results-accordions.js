const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
});

// ACCORDION 1: pension_threshold "or less"
export const getFirstAccordionHeader = pension => {
  return `${formatter.format(pension)} or less`;
};

// ACCORDION 2: pension_threshold + $1 through national_threshold
export const getSecondAccordionHeader = (pension, national) => {
  return `${formatter.format(pension + 1)} - ${formatter.format(national)}`;
};

// ACCORDION 3
// Non-standard: national_threshold + $1 through national_threshold + 10%
// Standard: national_threshold + $1 through gmt_threshold
export const getThirdAccordionHeader = (national, gmt, isStandard) => {
  if (!isStandard) {
    return `${formatter.format(national + 1)} - ${formatter.format(
      national * 1.1,
    )}`;
  }

  return `${formatter.format(national + 1)} - ${formatter.format(gmt)}`;
};

// ACCORDION 4
// Non-standard: national_threshold + $1 + 10% "or more"
// Standard: gmt_threshold + $1 through gmt_threshold + 10%
export const getFourthAccordionHeader = (national, gmt, isStandard) => {
  if (!isStandard) {
    return `${formatter.format(national * 1.1 + 1)} or more`;
  }

  return `${formatter.format(gmt + 1)} - ${formatter.format(gmt * 1.1)}`;
};

// ACCORDION 5 (does not appear for Non-standard case)
// Geographic threshold + 10% + $1 "or more"
export const getFifthAccordionHeader = gmt => {
  return `${formatter.format(gmt * 1.1 + 1)} or more`;
};