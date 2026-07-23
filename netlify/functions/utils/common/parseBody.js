//{ "name": "太郎", "age": 20 }→{ name: "太郎", age: 20 }
//のようにJSON 文字列を、key で使えるオブジェクトにする関数
export function parseBody(body) {
  if (!body) {
    return {};
  }

  try {
    return JSON.parse(body);
  } catch {
    return null;
  }
}
