# ChatsApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**createChatChatsPost**](#createchatchatspost) | **POST** /chats | Create a chat (direct or group)|
|[**getChatChatsChatIdGet**](#getchatchatschatidget) | **GET** /chats/{chat_id} | Get chat details and messages|
|[**listChatsChatsGet**](#listchatschatsget) | **GET** /chats | List chats for current user|
|[**sendMessageRestChatsChatIdMessagesPost**](#sendmessagerestchatschatidmessagespost) | **POST** /chats/{chat_id}/messages | Send a message (REST)|

# **createChatChatsPost**
> ChatDetail createChatChatsPost(chatCreate)

Create a direct chat with another user or a group chat when providing 2+ other users or a name.

### Example

```typescript
import {
    ChatsApi,
    Configuration,
    ChatCreate
} from './api';

const configuration = new Configuration();
const apiInstance = new ChatsApi(configuration);

let chatCreate: ChatCreate; //

const { status, data } = await apiInstance.createChatChatsPost(
    chatCreate
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **chatCreate** | **ChatCreate**|  | |


### Return type

**ChatDetail**

### Authorization

[OAuth2PasswordBearer](../README.md#OAuth2PasswordBearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Successful Response |  -  |
|**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getChatChatsChatIdGet**
> ChatWithMessagesPage getChatChatsChatIdGet()

Returns chat details and paginated messages (newest first).

### Example

```typescript
import {
    ChatsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ChatsApi(configuration);

let chatId: string; // (default to undefined)
let limit: number; // (optional) (default to 20)
let offset: number; // (optional) (default to 0)

const { status, data } = await apiInstance.getChatChatsChatIdGet(
    chatId,
    limit,
    offset
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **chatId** | [**string**] |  | defaults to undefined|
| **limit** | [**number**] |  | (optional) defaults to 20|
| **offset** | [**number**] |  | (optional) defaults to 0|


### Return type

**ChatWithMessagesPage**

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

# **listChatsChatsGet**
> PageChatPreview listChatsChatsGet()

Returns chat previews with last message. Supports pagination.

### Example

```typescript
import {
    ChatsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ChatsApi(configuration);

let limit: number; // (optional) (default to 20)
let offset: number; // (optional) (default to 0)

const { status, data } = await apiInstance.listChatsChatsGet(
    limit,
    offset
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **limit** | [**number**] |  | (optional) defaults to 20|
| **offset** | [**number**] |  | (optional) defaults to 0|


### Return type

**PageChatPreview**

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

# **sendMessageRestChatsChatIdMessagesPost**
> MessageOut sendMessageRestChatsChatIdMessagesPost(messageCreate)

Send a text or image message to a chat; primarily for fallback to WS.

### Example

```typescript
import {
    ChatsApi,
    Configuration,
    MessageCreate
} from './api';

const configuration = new Configuration();
const apiInstance = new ChatsApi(configuration);

let chatId: string; // (default to undefined)
let messageCreate: MessageCreate; //

const { status, data } = await apiInstance.sendMessageRestChatsChatIdMessagesPost(
    chatId,
    messageCreate
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **messageCreate** | **MessageCreate**|  | |
| **chatId** | [**string**] |  | defaults to undefined|


### Return type

**MessageOut**

### Authorization

[OAuth2PasswordBearer](../README.md#OAuth2PasswordBearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Successful Response |  -  |
|**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

