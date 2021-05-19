import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { interval, Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
// import swal from 'sweetalert2';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.css'],
})
export class VerifyComponent implements OnInit {
  title = 'personalLoan';
  count: number = 0;
  otpInputCount: number = 0;


  public resendOtpButtonDisabled: boolean = false;
  resendButtonTimeOut: Subscription;

  personalLoanForm: FormGroup;

  constructor(private http: HttpClient, private formBuilder: FormBuilder) {
    this.personalLoanForm = formBuilder.group({
      otp: ['1234', Validators.required],
      city: ['', Validators.required],
      panNumber: [
        '',
        [
          Validators.required,
          Validators.pattern('[A-Z]{5}[0-9]{4}[A-Z]{1}'),
          Validators.maxLength(10),
          Validators.minLength(10),
        ],
      ],
      fullname: ['', [Validators.required, Validators.maxLength(140)]],
      email: [
        '',
        [Validators.maxLength(255), Validators.required, Validators.email],
      ],
      mobile: [
        '',
        [Validators.required, Validators.pattern('[6-9]{1}[0-9]{9}')],
      ],
    });
  }

  get city() {
    return this.personalLoanForm.get('city');
  }
  get panNumber() {
    return this.personalLoanForm.get('panNumber');
  }
  get fullname() {
    return this.personalLoanForm.get('fullname');
  }
  get email() {
    return this.personalLoanForm.get('email');
  }
  get mobile() {
    return this.personalLoanForm.get('mobile');
  }
  get otp() {
    return this.personalLoanForm.get('otp');
  }

  ngOnInit() {

  }

  getOTPfunction() {
    this.http
      .post(
        'http://lab.thinkoverit.com/api/getOTP.php',
        this.personalLoanForm.value
      )

      .subscribe((res: any) => {
        // console.warn('result', res);
        if (res.statusCode === 200) {
          console.warn('result', res);
          Swal.fire({
            text: 'Sent OTP'
          })

          this.count++;
          this.otpInputCount++;
          this.resendOtpButtonDisabled = true;
          this.personalLoanForm.patchValue({
            otp: '',
          });

        }
      });



    const second = interval(1000);
    this.resendButtonTimeOut = second.subscribe((res) => {
      if (res >= 180) {
        this.resendButtonTimeOut.unsubscribe();
        this.resendOtpButtonDisabled = false;
      }
    });
  }

  verifyButton() {

    this.http
      .post('http://lab.thinkoverit.com/api/verifyOTP.php', {
        mobile: this.personalLoanForm.value.mobile,
        otp: this.personalLoanForm.value.otp,
      })
      .subscribe((res: any) => {
        console.warn('result', res);
        if (res.statusCode === 200) {
          Swal.fire({
            title: 'Thank you for verification!',
            text: this.personalLoanForm.value.fullname
          })

          this.otpInputCount = 0;
          this.count = 0;
          this.personalLoanForm.reset({});
          this.personalLoanForm.patchValue({
            otp: '1234'
          });

        }
      });


  }
  onlyNumber(event): any {
    const no = event.which ? event.which : event.keyCode;
    if (no > 31 && (no < 48 || no > 57)) {
      return false;
    }
    return true;
  }
}
