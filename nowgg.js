convert to html: /**


Embeds the now.gg website into a given HTML element.
 *


@param {string} elementId - The ID of the HTML element where the now.gg website should be embedded.


@throws {Error} Throws an error if the specified HTML element does not exist.
 */
function embedNowGG(elementId) {
    const element = document.getElementById(elementId);
    if (!element) {
        throw new Error(HTML element with ID '${elementId}' does not exist.);
    }
// Embedding now.gg website using an iframe
const iframe = document.createElement(‘iframe’);
iframe.src = ‘https://now.gg’;
iframe.width = ‘100%’;
iframe.height = ‘100%’;
iframe.frameBorder = ‘0’;
iframe.allowFullscreen = true;
// Appending the iframe to the specified HTML element
element.appendChild(iframe);
}


/**

Unit Tests for embedNowGG Function
 */

/**


Positive Test Case
 *


This test verifies that the now.gg website can be successfully embedded


into a valid HTML element.
 */
describe(‘Embed now.gg Website’, () => {
it(‘Should embed now.gg website into a valid HTML element’, () => {
    // Creating a mock HTML element
    const mockElement = document.createElement(‘div’);
    mockElement.id = ‘myElement’;
// Appending the mock element to the document body
document.body.appendChild(mockElement);

// Embedding now.gg website into the mock element
embedNowGG('myElement');

// Verifying that the iframe has been added to the mock element
const iframe = mockElement.querySelector('iframe');
assert.ok(iframe);
assert.strictEqual(iframe.src, 'https://now.gg');

});


});
/**


Negative Test Case
 *


This test verifies that an error is thrown when trying to embed the now.gg


website into a non-existent HTML element.
 */
describe(‘Error Handling’, () => {
it(‘Should throw an error when embedding into a non-existent HTML element’, () => {
    // Embedding into a non-existent HTML element with ID ‘nonExistentElement’
    assert.throws(() => embedNowGG(‘nonExistentElement’), Error, “HTML element with ID ‘nonExistentElement’ does not exist.”);
});


});
