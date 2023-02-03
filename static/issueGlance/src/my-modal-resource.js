import { view } from '@forge/bridge';

const context = await view.getContext();
const customValue = context.extension.modal.customKey;

view.close({
  formValues: [],
});