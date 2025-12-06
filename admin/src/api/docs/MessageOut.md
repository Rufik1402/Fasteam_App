# MessageOut


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** |  | [default to undefined]
**chat_id** | **string** |  | [default to undefined]
**from_user_id** | **string** |  | [default to undefined]
**text_content** | **string** |  | [optional] [default to undefined]
**image_content** | **string** |  | [optional] [default to undefined]
**created_at** | **string** |  | [default to undefined]
**seen_by** | [**Array&lt;MessageSeenOut&gt;**](MessageSeenOut.md) |  | [optional] [default to undefined]

## Example

```typescript
import { MessageOut } from './api';

const instance: MessageOut = {
    id,
    chat_id,
    from_user_id,
    text_content,
    image_content,
    created_at,
    seen_by,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
