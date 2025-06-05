from typing import Dict, Any
import json
from fastapi import HTTPException


def parse_filters(filters):
    filter_dict: Dict[str, Any] = {}
    if filters:
        try:
            filter_dict = json.loads(filters)
            print(filters)
            if not isinstance(filter_dict, dict):
                raise ValueError("Filters must be a dictionary")
        except (json.JSONDecodeError, ValueError) as e:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid filters format: {str(e)}"
            )
    return filter_dict
