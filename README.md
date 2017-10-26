# act-execution-to-xlsx

The act takes a JSON input containing a crawler executionID, downloads the results and converts them to XLSX.

The JSON input should be in following format:
```javascript
{"_id": EXECUTION_ID}
```
This can also be used from a crawler finish webhook.

You can obtain the resulting XLSX URL from default OUTPUT value where it is stored as follows:
```javascript
{"output": RESULT_XLSX_URL}
```

The URL is also outputted in the log.
