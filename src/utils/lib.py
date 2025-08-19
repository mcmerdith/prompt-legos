from typing import Any, TypeVar

def log(msg):
    print(f"[prompt-legos] {msg}")

class PromptBuildError(Exception):
    def __init__(self, message: str):
        self.message = message
        super().__init__(f"Failed to build prompt: {self.message} (this is a bug)")


FieldType = TypeVar("FieldType")


def require_dict_key(data: Any, key: str, check: type[FieldType] = None, cast: type[FieldType] = None) -> FieldType:
    if not isinstance(data, dict):
        raise PromptBuildError(f"invalid data from frontend; {type(data)} is not a dict")
    if not key in data:
        raise PromptBuildError(f"invalid data from frontend; missing '{key}' in {data}")
    value = data[key]
    if cast:
        try:
            return cast(value)
        except TypeError:
            pass
    if not check:
        return value
    if not isinstance(value, check):
        raise PromptBuildError(f"invalid data from frontend; bad type {type(value)}")
    return value


def find_by_id(values: list, _id: str):
    for value in values:
        if require_dict_key(value, "id", str) == _id:
            return value
    return None
