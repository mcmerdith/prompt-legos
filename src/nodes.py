class Bruh:
    @classmethod
    def INPUT_TYPES(s):
        return {
            "required": {
                "text": ("BRUH", {"tooltip": "the text"}),
            },
        }

    RETURN_TYPES = ("BRUH",)
    # RETURN_NAMES = ("image_output_name",)
    FUNCTION = "test"

    # OUTPUT_NODE = False
    # OUTPUT_TOOLTIPS = ("",) # Tooltips for the output node

    CATEGORY = "Prompt Legos"

    def test(self, text):
        return (text,)


# A dictionary that contains all nodes you want to export with their names
# NOTE: names should be globally unique
NODE_CLASS_MAPPINGS = {
    "Bruh": Bruh
}

# A dictionary that contains the friendly/humanly readable titles for the nodes
NODE_DISPLAY_NAME_MAPPINGS = {
    "Bruh": "Bruh Node"
}
