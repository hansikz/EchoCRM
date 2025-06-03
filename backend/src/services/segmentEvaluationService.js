export const buildMongoQueryFromRules = (rules) => {
  if (!Array.isArray(rules) || rules.length === 0) {
    return {}; // Return empty query if no rules
  }

  const queryParts = [];
  let currentGroup = []; // For handling AND/OR logic

  rules.forEach((rule, index) => {
    let condition = {};
    const field = rule.field;
    const operator = rule.operator;
    let value = rule.value;

    if (field === 'totalSpends' || field === 'visitCount' || field === 'lastSeenDays') {
      value = parseFloat(value);
      if (isNaN(value)) {
        console.warn(`Invalid numeric value for rule: ${field} ${operator} ${rule.value}`);
        return; 
      }
    } else if (field === 'tags' && (operator === 'contains' || operator === 'notContains' || operator === 'in' || operator === 'notIn')) {
        if (typeof value === 'string') { // if single tag string, convert to array for $in/$nin
            value = value.split(',').map(tag => tag.trim().toLowerCase());
        } else if (!Array.isArray(value)) {
            console.warn(`Invalid array value for tags rule: ${field} ${operator} ${rule.value}`);
            return;
        }
        value = value.map(tag => tag.toLowerCase()); 
    }

    switch (operator) {
      case '>': condition[field] = { $gt: value }; break;
      case '<': condition[field] = { $lt: value }; break;
      case '=': condition[field] = { $eq: value }; break;
      case '>=': condition[field] = { $gte: value }; break;
      case '<=': condition[field] = { $lte: value }; break;
      case '!=': condition[field] = { $ne: value }; break;
      case 'contains': // Primarily for array fields like tags
        if (field === 'tags') condition[field] = { $in: Array.isArray(value) ? value : [value] };
        else condition[field] = { $regex: value, $options: 'i' }; 
        break;
      case 'notContains':
        if (field === 'tags') condition[field] = { $nin: Array.isArray(value) ? value : [value] };
        else condition[field] = { $not: { $regex: value, $options: 'i' } };
        break;
      case 'in': 
        condition[field] = { $in: Array.isArray(value) ? value : value.split(',').map(v => v.trim()) };
        break;
      case 'notIn':
        condition[field] = { $nin: Array.isArray(value) ? value : value.split(',').map(v => v.trim()) };
        break;
      default:
        console.warn(`Unsupported operator: ${operator}`);
        return; // Skip rule with unsupported operator
    }

    if (index === 0 || !rule.logical) { 
        currentGroup.push(condition);
    } else {
        if (rule.logical === 'AND') {
            currentGroup.push(condition);
        } else if (rule.logical === 'OR') {
            if (currentGroup.length > 0) {
                queryParts.push({ $and: [...currentGroup] }); 
            }
            currentGroup = [condition]; 
        }
    }
  });

  if (currentGroup.length > 0) {
    queryParts.push({ $and: [...currentGroup] });
  }
  
  if (queryParts.length === 0) return {};
  if (queryParts.length === 1) return queryParts[0]; 
  return { $or: queryParts };
};