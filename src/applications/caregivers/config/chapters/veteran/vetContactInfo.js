import fullSchema from 'vets-json-schema/dist/10-10CG-schema.json';
import {
  veteranFields,
  emptyObjectSchema,
} from '../../../definitions/constants';
import {
  emailUI,
  alternativePhoneNumberUI,
  primaryPhoneNumberUI,
  addressWithoutCountryUI,
  emailEncouragementUI,
} from '../../../definitions/UIDefinitions/sharedUI';
import { vetInputLabel } from '../../../definitions/UIDefinitions/veteranUI';
import VeteranContactDescription from '../../../components/FormDescriptions/VeteranContactDescription';

const { veteran } = fullSchema.properties;
const veteranProps = veteran.properties;
const { address, phone } = fullSchema.definitions;

const vetContactInfoPage = {
  uiSchema: {
    'ui:description': VeteranContactDescription({
      pageTitle: 'Veteran contact information',
      showPageIntro: true,
    }),
    [veteranFields.address]: addressWithoutCountryUI(vetInputLabel),
    [veteranFields.primaryPhoneNumber]: primaryPhoneNumberUI(vetInputLabel),
    [veteranFields.alternativePhoneNumber]: alternativePhoneNumberUI(
      vetInputLabel,
    ),
    [veteranFields.emailEncouragementMessage]: emailEncouragementUI(),
    [veteranFields.email]: emailUI(vetInputLabel),
  },
  schema: {
    type: 'object',
    required: [veteranFields.address, veteranFields.primaryPhoneNumber],
    properties: {
      [veteranFields.address]: address,
      [veteranFields.primaryPhoneNumber]: phone,
      [veteranFields.alternativePhoneNumber]: phone,
      [veteranFields.emailEncouragementMessage]: emptyObjectSchema,
      [veteranFields.email]: veteranProps.email,
    },
  },
};

export default vetContactInfoPage;
