# Scripts used to transfer Google Form submissions to Clearstream

## Important Things Upfront

* [Clearstream Docs](https://api-docs.clearstream.io/)
* Clearstream API key [You can register an API key from inside your account.](https://app.clearstream.io/settings/api/keys)
* The scripts need to manually be imported to each Google form via script editor

## Notables

* The List's ID can be found in the url of the list in Clearstream (CS)
  * i.e. <https://app.clearstream.io/lists/239585> // 239585 is the id
* Tags need to be created in CS side before you can add it on the API side

## Sending Images via API

1. Upload image to google drive
2. Grab the file id from the url. For example, `1362JYBa2VyZBfg1oueLGVe_Q0Geb8QjE` is the file id for `https://drive.google.com/file/d/1362JYBa2VyZBfg1oueLGVe_Q0Geb8QjE/view`
3. Copy and paste file id to `uploadMediaToClearstream.js`
![SCR-20240814-ncby](https://github.com/user-attachments/assets/0f1fbeb4-ca00-48b6-9ee7-7c730fb441d9)
5. Run function and find the `media id` from the output
![SCR-20240814-nchs](https://github.com/user-attachments/assets/d8c35c2b-f9ee-4c3b-ad9b-16c9b8d09b91)

7. Copy and paste `media id` to `sendETicketMessage.js`
![SCR-20240814-ngin](https://github.com/user-attachments/assets/d4b45241-a87b-4b71-8178-28c6ca4c83bc)


## Flowchart (if it helps)

```mermaid
flowchart TD
  subgraph extractFormValues
    A(Google Form) --> B(First Name) & C(Last Name) & D(Phone Number) & E(All other data, like gender, year in scrool)
    E --> F(Tags)
    B & C & D & F --> G(data)
  end
```

```mermaid
flowchart TD
  subgraph data to clearstream
    a(data) --> b(check if user exists in CS)
    b --> |if not| c(createSubscribe) --> d(updateSubscriberWithTags) --> f(add to list, i.e. NSWN list)
    b --> |if exists| e(updateSubscriber)
    e --> g(check if in other list) --> |add the 'other' lists to payload|f
    g --> |if already in this list, which means they already registered|h(send 'Looks like you're already registered for this event.' message)
    f --> z(send e-ticket message)
  end
```

