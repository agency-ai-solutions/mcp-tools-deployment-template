from pydantic import Field

from agency_swarm import BaseTool


# Legacy tool example (not recommended)
class GetSecretWordTool(BaseTool):
    """test tool"""
    seed: int = Field(..., description="The seed for the random number generator")

    def run(self) -> str:
        """Returns a secret word based on the seed"""
        return "Strawberry" if self.seed % 2 == 0 else "Apple"
