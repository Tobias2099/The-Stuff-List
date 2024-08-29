// dragDrop.js

document.addEventListener('DOMContentLoaded', () => {
  const entries = document.querySelectorAll('.entry');
  let draggedItem = null;

  entries.forEach(entry => {
    entry.setAttribute('draggable', true); // Enable dragging

    entry.addEventListener('dragstart', function() {
      draggedItem = this;
      setTimeout(() => {
        this.classList.add('dragging');
      }, 0);
    });

    entry.addEventListener('dragend', function() {
      setTimeout(() => {
        this.classList.remove('dragging');
        draggedItem = null;
      }, 0);
    });

    entry.addEventListener('dragover', function(e) {
      e.preventDefault();
    });

    entry.addEventListener('dragenter', function(e) {
      e.preventDefault();
      this.classList.add('drop-target');
    });

    entry.addEventListener('dragleave', function() {
      this.classList.remove('drop-target');
    });

    entry.addEventListener('drop', function() {
      this.classList.remove('drop-target');
      if (draggedItem !== this) {
        const parent = this.parentNode;
        const draggedIndex = Array.from(parent.children).indexOf(draggedItem);
        const dropIndex = Array.from(parent.children).indexOf(this);

        if (draggedIndex < dropIndex) {
          parent.insertBefore(draggedItem, this.nextSibling);
        } else {
          parent.insertBefore(draggedItem, this);
        }

        updateOrder();
      }
    });

    function updateOrder() {
      const updatedOrder = [];
      const entries = document.querySelectorAll('.entry span');
      entries.forEach((entry, index) => {
        const entryName = entry.textContent.trim(); // Get the name/text of the entry
        console.log("ENTRY NAME: " + entryName); // Log the entry name
        console.log("COUNTER: " + entry.id.split('-').pop());
        console.log("ORDER: " + (index + 1));
        updatedOrder.push({
          id: entry.id.split('-').pop(), // Get the counter part of the id, assuming it's unique to the item
          order: index + 1, // New position/order
          entry: entryName
        });
      });
  
      // Send the updated order to the server
      fetch('/update-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ order: updatedOrder }),
      })
      .then(response => response.json())
      .then(data => {
        console.log('Order updated successfully:', data);
      })
      .catch((error) => {
        console.error('Error updating order:', error);
      });
    }
  })
});