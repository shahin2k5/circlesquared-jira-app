import React, { useEffect, useState } from 'react';
import { invoke, showFlag } from '@forge/bridge';
import Spinner from '@atlaskit/spinner';
import LoadingButton from '@atlaskit/button/loading-button';
import { RadioGroup } from '@atlaskit/radio';
import Form, { Field, FormFooter } from '@atlaskit/form';

function App() {
  const [rendering, setRendering] = useState(true);
  const [loading, setLoading] = useState(false);
  const [appSettings, setAppSettings] = useState({});
  const [user, setUser] = useState(null);

  useEffect(() => {
    invoke('getUser').then((response) => {
      if(response.user) {
        setUser(response.user);
        invoke('getAppSettings').then((settings) => {
          setAppSettings(settings);
          setRendering(false);
        })
      }
    });
  }, []);

  const toast = (type, message) => {
    const flag = showFlag({
      id: Math.random().toString(),
      title: message,
      type,
      isAutoDismiss: true
    });

    setTimeout(() => {
      flag.close();
    }, 3000);
  }

  const handleSubmit = (data) => {
    setLoading(true);
    invoke('updateAppSettings', { status: data.status }).then((response) => {
      setLoading(false);
      setAppSettings({...appSettings, status: data.status})
      if(response.status === parseInt(data.status)) {
        toast("success", "Settings updated");
      } else {
        toast("error", "Failed to update");
      }
    });
  }

  if(rendering) {
    return <Spinner/>;
  }

  if(!user) {
    return "Sorry! we could not fetch your profile.";
  }

  return (
    <div style={{ display: 'flex', maxWidth: '300px', flexDirection: 'column' }}>
      <Form onSubmit={handleSubmit}>
        {({ formProps }) => (
          <form {...formProps}>
            <Field name="status" defaultValue={appSettings?.status?.toString()} label="Enable the plugin for your circlesquared team.">
              {({ fieldProps }) => (
                <RadioGroup
                  options={[
                    { name: 'status', value: "1", label: 'Enable' },
                    { name: 'status', value: "0", label: 'Disable' },
                  ]}
                  {...fieldProps}
                />
              )}
            </Field>

            <FormFooter align="start">
              <LoadingButton type="submit" appearance="primary" isLoading={loading}>
                Save now
              </LoadingButton>
            </FormFooter>
          </form>
        )}
      </Form>
    </div>
  );
}

export default App;
