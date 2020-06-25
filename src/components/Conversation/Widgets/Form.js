import React, { useCallback, useState, useEffect } from 'react';
import uuid from 'uuid/v4';
import Loading from './components/Loading';
import { ReactComponent as RightArrow } from '../../../../assets/rightArrow.svg';

const STATUS = {
  INIT: 0,
  LOADING: 1,
  SUCCESS: 2,
  ERROR: 3,
};

const translation = {
  tr: {
    submit: 'Gönder',
    unexpectedError: 'Beklenmendik bir hata oluştu, lütfen daha sonra tekrar deneyin',
    fillRequiredFields: 'Lütfen tüm gerekli alanları doldurun',
  },
  en: {
    submit: 'Submit',
    unexpectedError: 'Unexpected error, please try again later',
    fillRequiredFields: 'Please fill all required fields',
  },
};

const Form = ({
  fields, language, sendMessage, setInputDisabled, persistState, state = { status: STATUS.INIT, error: null },
}) => {
  if (!fields) return null;
  const [formId, setFormId] = useState(null);

  const { status, error } = state;
  const translations = translation[language] || translation.en;

  useEffect(() => {
    if (!formId) {
      setFormId(uuid());
    }
    if (status !== STATUS.SUCCESS) {
      setInputDisabled(true);
    }
    return () => setInputDisabled(false);
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    const requiredNotFilled = fields.some((field, idx) => field.required && !e.target[`field-${idx}`].value);
    if (requiredNotFilled) {
      persistState({ status: STATUS.ERROR, error: translations.fillRequiredFields });
      return;
    }
    const formValues = fields.reduce((xs, field, idx) => ({ ...xs, [field.label]: e.target[`field-${idx}`]?.value || '' }), {});
    const msg = Object.entries(formValues).map(([label, val]) => `${label}: ${val || '-'}`).join('\n').trim();
    persistState({ status: STATUS.LOADING, formValues });
    try {
      await sendMessage(msg, false, formValues);
      persistState({ status: STATUS.SUCCESS });
      setInputDisabled(false);
    } catch (err) {
      console.error('Infoset Chat Widget: Error while sending message: ', err);
      persistState({ status: STATUS.ERROR, error: translations.unexpectedError });
    }
  };

  const disabled = status === STATUS.SUCCESS || status === STATUS.LOADING;
  const loading = status === STATUS.LOADING;

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%' }}>
      {fields.map((field, idx) => (field.label && field.type) ? (
        <div className="icw-input-container" key={idx}>
          <label htmlFor={`${formId}-field-${idx}`}>{field.label}{field.required && <sup>*</sup>}</label>
          <input
            required={field.required}
            defaultValue={state.formValues?.[field.label]}
            type={field.type.toLowerCase()}
            id={`${formId}-field-${idx}`}
            name={`field-${idx}`}
            disabled={disabled}
          />
        </div>
      ) : null)}
      {status === STATUS.ERROR && <small className="error">{error || translations.unexpectedError}</small>}
      <button type="submit" className="icw-mt-10 has-icon" disabled={disabled}>
        {translations.submit}
        {loading ? <Loading className="icon" /> : <RightArrow className="icon" />}
      </button>
    </form>
  );
};

export default Form;
