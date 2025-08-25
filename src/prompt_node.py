from comfy.comfy_types import IO, ComfyNodeABC, InputTypeDict
from comfy.comfy_types.node_typing import InputTypeOptions
from .utils.prompt import build_prompt
from .utils.lib import log

#####################################
# some jank to get types to work :) #
#####################################

LEGO_PROMPT_TYPE: IO = "LEGO_PROMPT"  # type: ignore


class PLInputTypeOptions(InputTypeOptions):
    segments: list[str]


##################
# the real stuff #
##################


class PromptLegosPrompt(ComfyNodeABC):
    @classmethod
    def INPUT_TYPES(cls) -> InputTypeDict:
        return {
            "required": {
                "force_case": (IO.COMBO, InputTypeOptions(options=["none", "lower", "upper"], default="none"))
            },

            "optional": {
                "lego_prompt": (LEGO_PROMPT_TYPE, PLInputTypeOptions(segments=["positive", "negative"]))
            },
        }

    RETURN_TYPES = (IO.STRING, IO.STRING,)
    RETURN_NAMES = ("positive_prompt", "negative_prompt",)
    FUNCTION = "build_prompt"

    CATEGORY = "Prompt Legos"

    # noinspection PyMethodMayBeStatic
    def build_prompt(self, lego_prompt: dict, force_case: str, **kwargs):
        if len(kwargs) > 0:
            log(f"[warning] got unexpected kwargs, {kwargs}")
        positive, negative = build_prompt(lego_prompt, force_case)
        return positive, negative







