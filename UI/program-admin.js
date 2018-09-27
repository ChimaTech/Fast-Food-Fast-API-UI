// GoTO Create Food Function
function goCreateFood() {
  location.assign('admin-page.html#sidebar-notification');
}


// GoTO Manage Order Function
function goManageOrder() {
  location.assign('manage-orders.html');
}


// Add Food Function
function addFood() {
  const foodName = document.querySelector('#sidebar-notification input[name="name"]').value;
  const priceTag = document.querySelector('#sidebar-notification input[name="price"]').value;
  const imageURL = document.querySelector('#sidebar-notification input[name="image"]').value;
  const comment = document.querySelector('p.comment');
  const foodEntryPoint = document.querySelector('section#editor-food-boxes div.foods-editors');

  if (foodName.length > 0 && priceTag.length > 0 && imageURL.length > 4) {
    const foodEntryDIV = document.createElement('div'); // Creates Food Entry DIV
    foodEntryDIV.setAttribute('class', 'food-entry'); // Set class
    foodEntryDIV.setAttribute('id', foodName);

    // Set foodEntryDIV's innerHTML
    foodEntryDIV.innerHTML = `<!-- A Dynamic Food Addition BEGINS --><div class="food"><label for=${foodName}>${foodName}</label><figure class="food"><img src=${imageURL} alt=${foodName}><figcaption class=${priceTag}>Price: $${priceTag}.00</figcaption></figure></div><div class="editors"><div class="edit-delete"><button type="button" name="edit" onclick="unHideEditor(event)">Edit</button><button type="button" name="delete" onclick="deleteFood(event)">Delete</button></div><div class="editor-inputs hide"><div class="input-div"><input type="text" name="name" value="" placeholder="Food's name:"><button type="button" name="button" onclick="reName(event)">Save</button></div><div class="input-div"><input type="number" name="price" min="0" placeholder="Food's price:"><button type="button" name="button" onclick="rePrice(event)">Save</button></div><div class="input-div"><input type="text" name="image" value="" accept="image/jpeg,image/x-png,image/gif" placeholder="Image URL:"><button type="button" name="button" onclick="reImage(event)">Save</button></div><div class="input-div"><div class="Add-food"><button type="button" name="button" onclick="hideEditor(event)">Exit</button></div></div></div></div><!-- A Dynamic Food Addition ENDS -->`;

    // Append foodEntryDIV to foodEntryPoint
    foodEntryPoint.appendChild(foodEntryDIV);

    // Clear the form
    const foodNameInput = document.querySelector('#sidebar-notification input[name="name"]');
    const priceTagInput = document.querySelector('#sidebar-notification input[name="price"]');
    const imageURLInput = document.querySelector('#sidebar-notification input[name="image"]');

    foodNameInput.value = '';
    priceTagInput.value = '';
    imageURLInput.value = '';
    comment.innerHTML = '';
  } else {
    comment.innerHTML = 'You have not completed the form yet.';
  }
}

// UnHide Editor Function
function unHideEditor(event) {
  const editor = event.target.parentNode.parentNode.querySelector('div.editor-inputs.hide');
  editor.setAttribute('class', 'editor-inputs unhide');
}

// Hide Editor Function
function hideEditor(event) {
  const editor = event.target.parentNode.parentNode.parentNode;
  editor.setAttribute('class', 'editor-inputs hide');
}

// Rename Function
function reName(event) {
  const foodName = event.target.parentNode.querySelector('input[name="name"]').value;


  if (foodName.length > 0) {
    const foodEntryDIV = event.target.parentNode.parentNode.parentNode.parentNode;

    foodEntryDIV.setAttribute('id', foodName); // Change Food Entry DIV's ID attribute

    const label = foodEntryDIV.querySelector('label');
    const imageElt = foodEntryDIV.querySelector('img');

    label.setAttribute('for', foodName); // Change label
    label.innerHTML = `${foodName}`; // Change label

    imageElt.setAttribute('alt', foodName); // Change Image Alt attribute

    // Clear Name Input field
    const clearNameField = event.target.parentNode.querySelector('input[name="name"]');
    clearNameField.value = '';
  }
}

// RePrice Function
function rePrice(event) {
  const foodPriceString = event.target.parentNode.querySelector('input[name="price"]').value;
  const foodPrice = Number(foodPriceString);

  if (foodPriceString.length > 0) {
    const foodEntryDIV = event.target.parentNode.parentNode.parentNode.parentNode;

    // Change figcaption
    const figCaption = foodEntryDIV.querySelector('figcaption');
    figCaption.setAttribute('class', `${foodPrice}`);
    figCaption.innerHTML = `Price: $${foodPrice}.00`;

    // Clear Price Input field
    const clearPriceField = event.target.parentNode.querySelector('input[name="price"]');
    clearPriceField.value = '';
  }
}

// ReImage Function
function reImage(event) {
  const imageURL = event.target.parentNode.querySelector('input[name="image"]').value;

  if (imageURL.length > 4) {
    const foodEntryDIV = event.target.parentNode.parentNode.parentNode.parentNode;

    // Change Image URL
    const imageElt = foodEntryDIV.querySelector('img');
    imageElt.setAttribute('src', `${imageURL}`);

    // Clear Image URL input field
    const removeImageURLField = event.target.parentNode.querySelector('input[name="image"]');
    removeImageURLField.value = '';
  }
}

// DeleteFood Function
function deleteFood(event) {
  const foodEntryDIV = event.target.parentNode.parentNode.parentNode;
  foodEntryDIV.remove(); // Food Entry from the parentNode
}
