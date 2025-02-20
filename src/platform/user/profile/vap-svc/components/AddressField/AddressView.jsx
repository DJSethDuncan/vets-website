import React from 'react';

import { formatAddress } from 'platform/forms/address/helpers';

export default function AddressView({ data: address }) {
  const { street, cityStateZip, country } = formatAddress(address);

  // Not hiding the country in Datadog RUM in case we encounter an issue with an
  // international address
  return (
    <>
      <div className="dd-privacy-hidden">{street}</div>
      <div className="dd-privacy-hidden">{cityStateZip}</div>
      {country && <div>{country}</div>}
    </>
  );
}
