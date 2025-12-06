# SearchApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**searchUsersSearchGet**](#searchuserssearchget) | **GET** /search | Search users|

# **searchUsersSearchGet**
> PageUserSearchPublic searchUsersSearchGet()

Fast user search across username, first_name, and last_name. Matches are case-insensitive and prioritize exact/prefix username matches.

### Example

```typescript
import {
    SearchApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new SearchApi(configuration);

let q: string; //Query string (default to undefined)
let limit: number; // (optional) (default to 20)
let offset: number; // (optional) (default to 0)

const { status, data } = await apiInstance.searchUsersSearchGet(
    q,
    limit,
    offset
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **q** | [**string**] | Query string | defaults to undefined|
| **limit** | [**number**] |  | (optional) defaults to 20|
| **offset** | [**number**] |  | (optional) defaults to 0|


### Return type

**PageUserSearchPublic**

### Authorization

[OAuth2PasswordBearer](../README.md#OAuth2PasswordBearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Successful Response |  -  |
|**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

