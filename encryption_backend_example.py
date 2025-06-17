"""
后端解密示例代码
这个示例展示如何在Python中解密前端加密的数据
"""
import base64
import binascii
from Crypto.Cipher import AES
from Crypto.Util.Padding import unpad

def aes_cbc_decrypt(encrypted_data, key):
    """
    AES-CBC模式解密
    
    参数:
    encrypted_data: Base64编码的加密数据，格式为<IV><密文>
    key: 密钥字节数据，长度为16/24/32字节
    
    返回:
    解密后的原始文本
    """
    # 确保密钥长度为16, 24或32字节（128, 192或256位）
    if len(key) not in (16, 24, 32):
        raise ValueError(f"Key must be either 16, 24, or 32 bytes long, got {len(key)} bytes")
    
    # 解码Base64数据
    encrypted_bytes = base64.b64decode(encrypted_data)
    
    # 从加密数据中分离出IV(前16字节)和密文部分
    iv = encrypted_bytes[:AES.block_size]  # 前16字节是IV
    ciphertext = encrypted_bytes[AES.block_size:]  # 剩余部分是密文
    
    print(f"IV (hex): {iv.hex()}")
    print(f"IV length: {len(iv)} bytes")
    print(f"Ciphertext length: {len(ciphertext)} bytes")
    
    # 创建解密器对象
    cipher = AES.new(key, AES.MODE_CBC, iv)
    
    # 解密数据并去除填充
    decrypted_padded = cipher.decrypt(ciphertext)
    decrypted = unpad(decrypted_padded, AES.block_size)
    
    # 返回解密后的UTF-8字符串
    return decrypted.decode('utf-8')

# 十六进制字符串密钥 - 16字节(128位)，需要与前端使用相同的密钥
SECRET_KEY_HEX = 'FD9213CB817A42E892A9FBEF4C5D3678'  # 32字符 = 16字节
# 将十六进制字符串转换为字节数据
SECRET_KEY = binascii.unhexlify(SECRET_KEY_HEX)

print(f"Hex key: {SECRET_KEY_HEX}")
print(f"Key length (hex string): {len(SECRET_KEY_HEX)} chars")
print(f"Key bytes: {SECRET_KEY.hex()}")
print(f"Key length (bytes): {len(SECRET_KEY)} bytes")

# 如果使用UTF-8字符串作为密钥，请使用:
# UTF8_KEY = '这是16字节UTF8密钥'
# SECRET_KEY = UTF8_KEY.encode('utf-8')
# print(f"UTF-8 key: {UTF8_KEY}")
# print(f"Key length (UTF-8): {len(SECRET_KEY)} bytes")

# 测试示例
def test_decrypt():
    # 这里粘贴前端生成的Base64加密结果进行测试
    encrypted_base64 = "从前端获取的加密Base64字符串"
    
    try:
        # 解密
        decrypted_text = aes_cbc_decrypt(encrypted_base64, SECRET_KEY)
        print(f"解密成功: {decrypted_text}")
        return decrypted_text
    except Exception as e:
        print(f"解密失败: {str(e)}")
        return None

# 在Web应用中的登录处理示例
def handle_login(request):
    """
    处理登录请求示例
    在Web框架(如Flask, Django)中使用
    """
    try:
        # 获取请求数据
        data = request.json
        
        # 检查是否加密
        if data.get('encrypted'):
            # 获取加密的密码
            encrypted_password = data.get('password')
            
            # 解密密码
            password = aes_cbc_decrypt(encrypted_password, SECRET_KEY)
            
            # 验证用户名和密码
            username = data.get('name')
            
            # TODO: 从数据库验证用户
            # user = db.validate_user(username, password)
            
            # 返回响应
            return {
                'code': 0,
                'msg': '登录成功',
                'data': {
                    'user_id': '123',
                    'access_token': 'sample_token'
                }
            }
        else:
            # 不接受非加密请求
            return {
                'code': -1,
                'msg': '请使用加密方式登录'
            }
    
    except Exception as e:
        return {
            'code': -1,
            'msg': f'登录失败: {str(e)}'
        }

if __name__ == "__main__":
    # 测试解密
    test_decrypt() 