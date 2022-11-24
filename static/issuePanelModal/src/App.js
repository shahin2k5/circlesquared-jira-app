import React, { Fragment, useState } from 'react';
import { view } from '@forge/bridge';
import Textfield from '@atlaskit/textfield';
import CrossIcon from '@atlaskit/icon/glyph/cross'
import Form, { Field } from '@atlaskit/form';
import Button from '@atlaskit/button';
import LoadingButton from '@atlaskit/button/loading-button';
import Progressbar from './components/Progressbar';
import DynamicTable from '@atlaskit/dynamic-table';

function App() {
	const [loading, setLoading] = useState(false);
	const [runs, setRuns] = useState([])
	const handleSubmit = (data) => {
		setLoading(true);
		const response = [
			{ id: 1, name: "Run 1", project: "Project 1", author: "wahid@gmail.com", status: { passed: 5, failed: 0, blocked: 0, invalid: 1, skipped: 1 } },
			{ id: 2, name: "Run 2", project: "Project 2", author: "wahid@gmail.com", status: { passed: 3, failed: 0, blocked: 0, invalid: 1, skipped: 0 } },
			{ id: 3, name: "Run 3", project: "Project 1", author: "wahid@gmail.com", status: { passed: 0, failed: 3, blocked: 0, invalid: 1, skipped: 0 } },
			{ id: 4, name: "Run 4", project: "Project 1", author: "wahid@gmail.com", status: { passed: 3, failed: 0, blocked: 0, invalid: 1, skipped: 0 } },
			{ id: 5, name: "Run 5", project: "Project 2", author: "wahid@gmail.com", status: { passed: 0, failed: 0, blocked: 1, invalid: 1, skipped: 0 } },
			{ id: 6, name: "Run 6", project: "Project 1", author: "wahid@gmail.com", status: { passed: 2, failed: 0, blocked: 0, invalid: 1, skipped: 0 } },
		];
		setRuns(response);
		setLoading(false);
	}

	return (
		<div>
			<div style={{ padding: "15px 20px", display: "flex", justifyContent: "space-between", backgroundColor: "#f9f9f9" }}>
				<h2>Search Test Runs</h2>
				<Button appearance="subtle-link" spacing="none" onClick={() => view.close()}><CrossIcon/></Button>
			</div>
			<div style={{ padding: "15px 20px" }}>
				<Form onSubmit={handleSubmit}>
					{({ formProps }) => (
						<form {...formProps} style={{ display: "flex", gap: "10px", alignItems: "flex-end", marginBottom: "15px" }}>
							<div style={{ flex: 1 }}>
								<Field
									aria-required={true}
									name="q"
									defaultValue=""
									isDisabled={loading}
									isRequired
								>
									{({ fieldProps }) => (
										<Textfield {...fieldProps} type="search" placeholder="Search runs by name"/>
									)}
								</Field>
							</div>
							<LoadingButton type="submit" appearance="primary" style={{ height: "auto", paddingTop: "3.5px", paddingBottom: "3.5px" }} isLoading={loading}>Search</LoadingButton>
						</form>
					)}
				</Form>
				
				<DynamicTable
					head={{
						cells: [
							{ content: 'Title' },
							{ content: 'Project' },
							{ content: 'Author' },
							{ content: 'Status' },
						]
					}}
					rows={runs.map(run => ({
						key: run.id,
						cells: [
							{ content: run.name },
							{ content: run.project },
							{ content: run.author },
							{ content: (
								<div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
									<Progressbar status={run.status}/>
									<Button spacing="compact" appearance="primary" onClick={() => alert(run.id)}>Link</Button>
								</div>
								)
							},
						]
					}))}
					rowsPerPage={14}
					defaultPage={1}
					loadingSpinnerSize="small"
					isLoading={loading}
					emptyView="No result"
				/>
			</div>
		</div>
	);
}

export default App;