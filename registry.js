// विभाग रजिस्ट्री: हर विभाग एक स्वतंत्र फ़ाइल है जो registerDepartment() को बुलाती है।
// Department shape:
// { id, name, officer, fields:[{id,q,hint,options?,optional?,validate?(v)->errorText|null}], template(answers)->string }
window.DEPARTMENTS = {};
window.registerDepartment = d => { window.DEPARTMENTS[d.id] = d; };
