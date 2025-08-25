from typing import Any

from .lib import log, require_dict_key, find_by_id, PromptBuildError


def weighted_value(value: list[str | None] | str, weight=1.0):
    """
    Combine a list of strings and apply a weight, removing all empty strings

    ['a', 'b', 'c'], 1 => 'a, b, c'

    ['a', '', 'b',], 1.2 = '(a, b:1.2)'

    :param value: A list of string values
    :param weight: A weight (omitted if weight = 1)
    :return: A combined, filtered, weighted string
    """
    if weight <= 0:
        return None
    # handle singular and list items
    if isinstance(value, list):
        values = value
    else:
        values = [value]
    filtered_values = [v.strip() for v in values if v is not None and v.strip() != ""]
    if len(value) == 0:
        return None
    full_value = ", ".join(filtered_values)
    if weight == 1.0:
        return full_value
    return f"({full_value}:{weight})"


def build_prompt(prompt_data: Any, force_case: str):
    prompts = require_dict_key(prompt_data, "prompts", list)

    positive = find_by_id(prompts, "positive")
    negative = find_by_id(prompts, "negative")

    if negative is None or positive is None:
        raise PromptBuildError("Invalid prompt!")

    return build_single_prompt(positive, force_case), build_single_prompt(negative, force_case)


def build_single_prompt(single_prompt: Any, force_case: str):
    sections = require_dict_key(single_prompt, "sections", check=list)
    weighted_sections = []
    for section in sections:
        groups = require_dict_key(section, "groups", check=list)
        section_weight = require_dict_key(section, "weight", cast=float)
        weighted_groups = []
        for group in groups:
            items = require_dict_key(group, "items", check=list)
            group_weight = require_dict_key(group, "weight", cast=float)
            weighted_items = []
            for item in items:
                value = require_dict_key(item, "value", check=str)
                item_weight = require_dict_key(item, "weight", cast=float)
                weighted_items.append(weighted_value(value, item_weight))
            weighted_groups.append(weighted_value(weighted_items, group_weight))
        weighted_sections.append(weighted_value(weighted_groups, section_weight))
    built_prompt = weighted_value(weighted_sections, 1)

    log(f"built prompt: {built_prompt}")
    if built_prompt is None:
        return ""
    else:
        if force_case == "upper":
            return built_prompt.upper()
        elif force_case == "lower":
            return built_prompt.lower()
        else:
            return built_prompt
