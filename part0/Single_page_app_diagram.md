sequenceDiagram
    participant browser
    participant server
        Note left of browser: User submits the form with note content
        Note left of browser: Default form submit prevented by event handler
        Note left of browser: New note is created
        Note left of browser: New note is added to the Notes list
        Note left of browser: Browser appends new note at the bottom of the list
        Note left of browser: Browser sends new note to the server

    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa
    activate server
    server-->>browser: Server response - HTTP status code 201 Created (no redirect)
    deactivate server

 