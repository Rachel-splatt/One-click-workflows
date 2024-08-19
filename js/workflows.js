"use strict";
document.addEventListener('DOMContentLoaded', () => {
    const publishButtons = document.querySelectorAll('.one-click-workflows .button.primary');
    publishButtons.forEach((button, index) => {
        button.addEventListener('click', () => createPublishedWorkflow(index));
    });
    // Initial check
    checkAndUpdateOneClickWorkflowsVisibility();
});
function createPublishedWorkflow(index) {
    var _a, _b;
    const workflows = document.querySelectorAll('.one-click-workflows');
    const workflow = workflows[index];
    const title = ((_a = workflow.querySelector('h4')) === null || _a === void 0 ? void 0 : _a.textContent) || 'Untitled Workflow';
    const description = ((_b = workflow.querySelector('p')) === null || _b === void 0 ? void 0 : _b.textContent) || '';
    const newWorkflowWrapper = document.createElement('div');
    newWorkflowWrapper.innerHTML = `
        <table>
            <caption>
                <div style="display: flex; align-items: center;">
                    <h3 style="margin-right: auto;">${title}</h3>
                    <div style="display: flex; gap: var(--spacer-4); align-items: center;">
                        <small><span class="icon icon-circle-fill"></span> Published</small>
                        <div class="button-group">
                            <a class="button" aria-label="Edit workflow" href="#"><span class="icon icon-pencil"></span></a>
                            <button class="button outline-danger" type="button" aria-label="Delete workflow"><span class="icon icon-trash2"></span></button>
                        </div>
                    </div>
                </div>
            </caption>
            <thead>
                <tr>
                    <th style="width: 40%;">Email</th>
                    <th>Delay</th>
                    <th>Sent</th>
                    <th>Opens</th>
                    <th>Clicks</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td data-label="Email">${description}</td>
                    <td data-label="Delay">24 Hours</td>
                    <td data-label="Sent" style="white-space: nowrap;">0</td>
                    <td data-label="Opens" style="white-space: nowrap;">0%</td>
                    <td data-label="Clicks" style="white-space: nowrap;">0</td>
                </tr>
            </tbody>
        </table>
    `;
    // Find the workflow-list div
    const workflowList = document.getElementById('workflow-list');
    if (workflowList) {
        // Insert the new wrapper div as the first child of workflow-list
        workflowList.insertBefore(newWorkflowWrapper, workflowList.firstChild);
        // Ensure the workflow-list div has the correct styling
        workflowList.style.display = 'grid';
        workflowList.style.gap = 'var(--spacer-7)';
    }
    // Add event listener to the delete button
    const deleteButton = newWorkflowWrapper.querySelector('.button.outline-danger');
    if (deleteButton) {
        deleteButton.addEventListener('click', () => deletePublishedWorkflow(newWorkflowWrapper, workflow));
    }
    // Hide the original one-click-workflows section
    workflow.style.display = 'none';
    // Check if all workflows are published and hide the container if necessary
    checkAndUpdateOneClickWorkflowsVisibility();
}
function deletePublishedWorkflow(publishedWorkflow, originalWorkflow) {
    // Remove the published workflow
    publishedWorkflow.remove();
    // Show the original one-click-workflows section
    originalWorkflow.style.display = '';
    // Reset the original workflow section
    const statusIndicator = originalWorkflow.querySelector('p span.icon');
    if (statusIndicator instanceof HTMLElement) {
        statusIndicator.style.color = '';
    }
    const statusText = originalWorkflow.querySelector('p');
    if (statusText) {
        statusText.textContent = 'Unpublished';
    }
    const publishButton = originalWorkflow.querySelector('.button.primary');
    if (publishButton) {
        publishButton.textContent = 'Publish';
    }
    // Check if any workflows are still published and show the container if necessary
    checkAndUpdateOneClickWorkflowsVisibility();
}
function checkAndUpdateOneClickWorkflowsVisibility() {
    const statsGrid = document.querySelector('.stats-grid');
    if (!(statsGrid instanceof HTMLElement))
        return;
    const oneClickWorkflows = statsGrid.querySelectorAll('.one-click-workflows');
    const anyVisible = Array.from(oneClickWorkflows).some(workflow => workflow instanceof HTMLElement && workflow.style.display !== 'none');
    const parentDiv = statsGrid.parentElement;
    if (parentDiv instanceof HTMLElement) {
        parentDiv.style.display = anyVisible ? '' : 'none';
    }
}
