export default (props) => {
    const { status } = props;
    let title = '';
    if(status.passed) {
        title += title.length ? ', ' : '';
        title += status.passed + ' passed';
    }
    if(status.failed) {
        title += title.length ? ', ' : '';
        title += status.failed + ' failed';
    }
    if(status.blocked) {
        title += title.length ? ', ' : '';
        title += status.blocked + ' blocked';
    }
    if(status.invalid) {
        title += title.length ? ', ' : '';
        title += status.invalid + ' invalid';
    }
    if(status.skipped) {
        title += title.length ? ', ' : '';
        title += status.skipped + ' skipped';
    }
    return (
        <div style={{ display: "flex", flexGrow: 1, height: "8px", overflow: "hidden", borderRadius: "3px", background: "#e9ecef" }} title={title.length ? title : 'No test cases'}>
            {[...Array(status.passed)].map((e, i) => (
                <div key={i} style={{ background: "limegreen", display: "flex", flex: 1 }}></div>
            ))}
            {[...Array(status.failed)].map((e, i) => (
                <div key={i} style={{ background: "tomato", display: "flex", flex: 1 }}></div>
            ))}
            {[...Array(status.blocked)].map((e, i) => (
                <div key={i} style={{ background: "goldenrod", display: "flex", flex: 1 }}></div>
            ))}
            {[...Array(status.invalid)].map((e, i) => (
                <div key={i} style={{ background: "lightgray", display: "flex", flex: 1 }}></div>
            ))}
            {[...Array(status.skipped)].map((e, i) => (
                <div key={i} style={{ background: "gray", display: "flex", flex: 1 }}></div>
            ))}
        </div>
    )
}