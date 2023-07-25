import { expect } from 'chai';
import { formatName, generatePdfScaffold } from '../util/helpers';

describe('formatName', () => {
  const first = 'John';
  const last = 'Jingleheimer';
  const middle = 'Jacob';
  const suffix = 'Jr.';

  it("should format the user's name with all fields", () => {
    const userProfile = {
      first,
      last,
      middle,
      suffix,
    };
    const name = formatName(userProfile);
    expect(name).to.eq('Jingleheimer, John Jacob, Jr.');
  });

  it("should format the user's name with first and last", () => {
    const userProfile = {
      first,
      last,
    };
    const name = formatName(userProfile);
    expect(name).to.eq('Jingleheimer, John');
  });

  it("should format the user's name with first, middle, and last", () => {
    const userProfile = {
      first,
      last,
      middle,
    };
    const name = formatName(userProfile);
    expect(name).to.eq('Jingleheimer, John Jacob');
  });

  it("should format the user's name with first, last, and suffix", () => {
    const userProfile = {
      first,
      last,
      suffix,
    };
    const name = formatName(userProfile);
    expect(name).to.eq('Jingleheimer, John, Jr.');
  });
});

describe('generatePdfScaffold', () => {
  const user = {
    userFullName: {
      first: 'John',
      last: 'Jingleheimer',
      middle: 'Jacob',
      suffix: 'Jr.',
    },
    dob: '1979-06-05',
  };
  const title =
    'Lab and test results: Microbiology on August 3, 1995 8:49 a.m.';
  const subject = 'VA Medical Record';
  const preface =
    'If you have any questions about these results, send a secure message to your care team.';

  it('generate a pdf scaffold object', () => {
    const scaffold = generatePdfScaffold(user, title, subject, preface);
    expect(scaffold.headerLeft).to.eq('Jingleheimer, John Jacob, Jr.');
    expect(scaffold.headerRight).to.eq('Date of birth: June 5, 1979');
    expect(scaffold.headerBanner[0].text).to.eq(
      'If you’re ever in crisis and need to talk with someone right away, call the Veterans Crisis line at ',
    );
    expect(scaffold.footerLeft).to.include(
      'Report generated by My HealtheVet and VA on',
    );
    expect(scaffold.footerRight).to.eq('Page %PAGE_NUMBER% of %TOTAL_PAGES%');
    expect(scaffold.title).to.include(
      'Lab and test results: Microbiology on August',
    );
    expect(scaffold.subject).to.eq('VA Medical Record');
    expect(scaffold.preface).to.eq(
      'If you have any questions about these results, send a secure message to your care team.',
    );
  });
});