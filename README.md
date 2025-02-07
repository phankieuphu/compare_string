{

"input": "trẻ ${old} tuổi có tiêm vacxin ${xyz} được không",

"output": "trẻ ${old} tuổi ${can_or_not} tiêm vacxin theo khuyến cáo của bác sĩ, theo khuyến cáo để được tiêm vacxin ${xyz} cần phải dưới ${old_min} , và không được quá ${old_max} ",

"result": true

}



đây là trường hợp json ví dụ



1. Giúp tôi render thêm 10 trường hợp khác follow theo concept đó

2. Thay đổi các : ${old} tuổi hoặc tháng, ${xyz} tên loại vacxin, ${old_min} độ tuổi tối thiểu, ${old_max} độ tuổi tối đa , ${can_or_not} là ${old} có tuân thủ và có thể tiêm không?

3. nếu có thể tiêm thì result = true, và không thể => false

4. nếu cung cấp 1 số loại vacxin thực tế thì càng tốt

5. tôi cần khoảng 5 - 10 trường hợp KHÁC NHAU

6. trả về json
# compare_string
