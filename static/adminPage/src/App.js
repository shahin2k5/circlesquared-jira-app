import React, { useEffect, useState } from 'react';
import { invoke, showFlag } from '@forge/bridge';
import Spinner from '@atlaskit/spinner';
import LoadingButton from '@atlaskit/button/loading-button';
import { RadioGroup } from '@atlaskit/radio';
import Form, { Field, FormFooter } from '@atlaskit/form';

function App() {
  const [rendering, setRendering] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isAppActive, setIsAppActive] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    invoke('getUser').then((response) => {
      if(response.user) {
        setUser(response.user);
        invoke('getAppSettings').then((response) => {
          if(response.active) {
            setIsAppActive(response.active);
            toast("info", "You are already connected.")
          }
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
    invoke('updateAppSettings', { active: data.activation }).then((response) => {
      setLoading(false);
      setIsAppActive(data.activation);

      if(response.active) {
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
            <Field name="activation" defaultValue={isAppActive.toString()} label="Enable the plugin for your circlesquared team.">
              {({ fieldProps }) => (
                <RadioGroup
                  options={[
                    { name: 'activation', value: "true", label: 'Enable' },
                    { name: 'activation', value: "false", label: 'Disable' },
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
