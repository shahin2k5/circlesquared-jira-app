import Resolver from '@forge/resolver';

import { getAppSettings, getUser } from './helper';

const resolver = new Resolver();

resolver.define('getUser', getUser);

resolver.define('getAppSettings', getAppSettings);

resolver.define('getTestcaseSearch', async (req) => {
  
  const params =  req.payload;
  const ticket = req.context.extension.issue.id
  const project = req.context.extension.project.id
  
  const circlesquared = api.asUser().withProvider('circlesquared', 'circlesquared-apis')
  const response =   await circlesquared.fetch(`/api/app/jira/tests/search?q=${params.q}&project=${project}&ticket=${ticket}`, { headers: { "Accept": "application/json" } });
  if(response.ok){
    const { data: data } =  await response.json();
    return data || {};
  }else{
    const error=  await response.error();
    throw new Error(JSON.stringify(error));
  }
 
});

resolver.define('makeLinedkTestcaseTicket', async (req) => {
  const testId =  req.payload;
  const ticket = req.context.extension.issue.id
  const project = req.context.extension.project.id
 
  const circlesquared = api.asUser().withProvider('circlesquared', 'circlesquared-apis')
  const response =   await circlesquared.fetch(`/api/app/jira/tests/link?testcase_id=${testId}&project=${project}&ticket=${ticket}`, { headers: { "Accept": "application/json" },"method":"put" });
  if(await response.ok){
    const { data: data } =  await response.json();
    return data || {};
  }else{
    //const error= response.status+": "+response.statusText;
    const error= await response;
    throw new Error(JSON.stringify(response));
  }
  

});

resolver.define('unlinkTestcaseTicket', async (req) => {
  const testId =  req.payload;
  const ticket = req.context.extension.issue.id
  const project = req.context.extension.project.id
  
  const circlesquared = api.asUser().withProvider('circlesquared', 'circlesquared-apis')
  const response =   await circlesquared.fetch(`/api/app/jira/tests/unlink?testcase_id=${testId}&project=${project}&ticket=${ticket}`, { headers: { "Accept": "application/json" },"method":"put" });
  if(await response.ok){
    const { data: data } =  await response.json();
    return data || {};
  }else{
    //const error= response.status+": "+response.statusText;
    const error= await response;
    throw new Error(JSON.stringify(response));
  }
  

});


resolver.define('getIssueTestcases',async (req) => {
  const ticket = req.context.extension.issue.id
  const project = req.context.extension.project.id
  
  const circlesquared = api.asUser().withProvider('circlesquared', 'circlesquared-apis')
  const response =   await circlesquared.fetch(`/api/app/jira/tests/list?project=${project}&ticket=${ticket}`, { headers: { "Accept": "application/json" }});
  if(await response.ok){
    const { data: data } =  await response.json();
    return data || {};
  }else{
    const error= await response;
    throw new Error(JSON.stringify(response));
  }
  
 
});

 

export const handler = resolver.getDefinitions();
