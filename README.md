# The Stuff List

## Overview

I built this To-do list app because I have a habit of keeping track of my schedule in my head. I wanted a simple, minimalistic solution to ensure I don't forget things without needing to add excessive information for each entry.

This app was built using Express.js on Node.js to handle the backend, and EJS to maintain the frontend. I also used SQL on PostgreSQL to handle data This app was built using:

- Express.js on Node.js: For the backend
- EJS: For the frontend templating
- PostgreSQL: To handle data, including item descriptions and deletion dates (useful for clearing old deleted items from the database)
- JavaScript, CSS, and Git

## Features

- Add Items: Type your to-do items, which will be displayed as entries in the center of the page.
- Edit Items: Change the item's text and save the changes using the entry's pen button.
- Delete Items: Remove an entry by clicking the checkmark button.
- Restore Items: If you delete an entry by accident, use the "Restore" button above the entries to recover it. The button restores entries one by one, starting from the most recently deleted. Note: Entries deleted more than two weeks ago cannot be restored.

## Future Plans

- Improve Editing Feature: Currently, users are limited in the number of characters they can type when editing an entry before the format breaks.
- Deadline Tracker: Add a feature to track deadlines for each entry using APIs.
- Drag-and-Drop Sorting: Allow users to determine the order of entries by dragging items.