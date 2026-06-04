export type FieldType = 'text' | 'textarea';

export interface FieldDef {
  key: string;
  label: string;
  example: string;
  type: FieldType;
}

export interface CategoryDef {
  id: string;
  title: string;
  fields: FieldDef[];
}

export type FormValues = Record<string, string>;

export interface AdditionalOutputs {
  summaryOnePage: boolean;
  appendix: boolean;
  qa: boolean;
  emailDraft: boolean;
  speakerNotes: boolean;
  pptxRequest: boolean;
}

export interface AppState {
  values: FormValues;
  outputs: AdditionalOutputs;
}
