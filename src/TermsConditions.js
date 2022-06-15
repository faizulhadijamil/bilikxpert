import { Typography } from 'material-ui';
import React from 'react';

class TermsConditions extends React.Component {

  componentDidMount() {
    window.scrollTo(0, 0)
  }

  render(){

    const href = window.location.href;
    const isSpecialTnC = href && href.indexOf('special') !== -1;

    return (
      <div style={{margin:64, width:'90%', maxWidth:600, display:'flex', flex:1, justifyContent:'center', flexDirection:'column', marginLeft:'auto', marginRight:'auto'}}>
        <Typography type="display1" component="h1" color="primary" style={{marginBottom:16, marginLeft:'auto', marginRight:'auto', color:'rgba(0, 0, 0, 0.54)', textAlign:'center'}}>
          {`TERMS & CONDITIONS`}</Typography>

        <Typography type="body1" component="h1" color="primary" style={{marginBottom:16, marginLeft:'auto', marginRight:'auto', color:'rgba(0, 0, 0, 0.54)', textAlign:'justify'}}>
          {`At B Fitness Asia Sdn. Bhd. (1204067-X), its subsidiaries and affiliates including Babel Academy operating under the Babel brand (collectively known as “Babel”), we have adopted policies, procedures, rules and regulations, terms and conditions ("policies") designed to provide for the safe, enjoyable and healthy use of our premises and events for our members and trial member, guest, purchaser or user (collectively known as "guest").`}</Typography>

        <Typography type="body1" component="h1" color="primary" style={{marginBottom:16, marginLeft:'auto', marginRight:'auto', color:'rgba(0, 0, 0, 0.54)', textAlign:'justify'}}>
          {`These policies apply to your conduct in Babel's premises, which include its centres and all outdoor areas, including its swimming pool, parking lots, sidewalks (collectively known as "premises"). They also apply to your conduct during its programmes, training, workshops, events or other activities off the premises involving Babel (collectively known as "events").`}</Typography>


        <Typography type="body1" component="h1" color="primary" style={{marginBottom:16, marginLeft:'auto', marginRight:'auto', color:'rgba(0, 0, 0, 0.54)', textAlign:'justify'}}>
          {`The following terms & conditions govern the rights and obligation of Babel and members thereof:`}</Typography>


        <Typography type="title" component="h1" color="primary" style={{marginBottom:16, marginLeft:'auto', marginRight:'auto', color:'rgba(0, 0, 0, 0.54)', textAlign:'center'}}>
          {`MONTHLY | HALF YEARLY | YEARLY MEMBERSHIPS`}</Typography>


        <Typography type="title" component="h1" color="primary" style={{marginBottom:16, marginLeft:'auto', marginRight:'auto', color:'rgba(0, 0, 0, 0.54)', textAlign:'justify'}}>
          {`MEMBERSHIP`}</Typography>

        {!isSpecialTnC &&
          <Typography type="body1" component="h1" color="primary" style={{marginBottom:16, marginLeft:'auto', marginRight:'auto', color:'rgba(0, 0, 0, 0.54)', textAlign:'justify'}}>
            {`Membership is personal to the individual signed up and is non-assignable, non-refundable and non-transferable.
            The Management reserves the right to reject any application for Babel's membership for any reason whatsoever.
            Monthly members are required to pay an Initial Joining Fee which is the specified sum. The Joining Fee will be used to REBATE and offset the 13th month membership dues when member fulfills an active membership of 12 months consecutively.
            Refunds - Joining Fees and Membership Fees are NOT refundable upon termination of membership for any reason whatsoever.
            Freezing - Member may email to hello@babel.fit to freeze his/her membership at any time with a MINIMUM term of 1 month. First 3 freezing months of the calendar year (not necessarily consecutive) will be free of charge. Subsequent freezing months will be charged a minimal freezing fee of RM50.00 per month. NO BACK DATE freeze will be allowed, all freezing request MUST be emailed 7 days prior to freezing start date.
            Cancellation - Member may email to hello@babel.fit to cancel his/her membership stating the reason for cancellation. Cancellation request must be made at least  7 days prior to the next billing date. Member is required to settle all outstanding payments and return the membership card before cancellation can occur.`}</Typography>
        }
        {isSpecialTnC &&
          <Typography type="body1" component="h1" color="primary" style={{marginBottom:16, marginLeft:'auto', marginRight:'auto', color:'rgba(0, 0, 0, 0.54)', textAlign:'justify'}}>
            {`Membership is personal to the individual signed up and is non-assignable, non-refundable and non-transferable.
            The Management reserves the right to reject any application for Babel's membership for any reason whatsoever.
            Members will be billed monthly for 12 full months. Billing date will be based on the start date assigned or the first check-in at the gym, whichever comes first. Payments can be made either via auto-debit, an online payment link using debit and credit cards or over-the-counter at the reception.
            Refunds - Membership Fees are not refundable upon early termination of membership for any reason whatsoever.
            Freezing - Member may email to hello@babel.fit to freeze his/her membership at any time with a minimum term of 1 month. First 3 freezing months of the calendar year (not necessarily consecutive) will be free of charge. Subsequent freezing months will be charged a minimal freezing fee of RM50.00 per month. No back date freeze will be allowed, all freezing request must be emailed 7 days prior to freezing start date.
            Cancellation - Member may email to hello@babel.fit to cancel his/her membership stating the reason for cancellation. Members will still be liable for the remaining months in the package period and whatever outstanding amount incurred to date upon cancelation. Cancellation request has to be made 7 days before the end of the package period in order to avoid renewals for the next 12 months.
            `}</Typography>
        }

        <Typography type="title" component="h1" color="primary" style={{marginBottom:16, marginLeft:'auto', marginRight:'auto', color:'rgba(0, 0, 0, 0.54)', textAlign:'center'}}>
          {`PERSONAL TRAINING`}</Typography>


        <Typography type="title" component="h1" color="primary" style={{marginBottom:16, marginLeft:'auto', marginRight:'auto', color:'rgba(0, 0, 0, 0.54)', textAlign:'center'}}>
          {`PERSONAL TRAINING SERVICES`}</Typography>

        <Typography type="body1" component="h1" color="primary" style={{marginBottom:16, marginLeft:'auto', marginRight:'auto', color:'rgba(0, 0, 0, 0.54)', textAlign:'justify'}}>
          {`Member must complete all details for the Personal Training Services Agreement, sign it and retain a copy of it for his or her records.
          Member's personal training is an arrangement between him or her and the operator of the Home Club as specified in the Personal Training Agreement. Once he or she has signed a copy of the Personal Training Services Agreement, member has agreed to be bound by a binding contract.
          Fitness Instructor/Trainer is not a medical professional and is without expertise to diagnose medical conditions or impairments. The member agrees to promptly and fully disclose to Fitness Instructor/Trainer any injury, condition or impairment which may have a deleterious effect on or be impacted by this training program and the Fitness Instructor's/Trainer’s decision to discontinue training because of any condition which presents an adverse risk or threat to the health or safety of the member, the Fitness Instructor/Trainer or others shall be conclusive.
          The fee for the program is payable in advance of Sessions in one lump sum (at least) 3 days prior to the scheduled session appointment. Payments should be made at Customer Service Counter or via the Babel App (as defined below). The member will not be allowed to pay the Fitness Instructor/Trainer directly for a session.
          Fitness Profile Package - As marked in Personal Training Package Section, all sessions has an ‘End Date’ or 'Expiration Date'. If in any case the purchased Personal Training Package will not be finished before the "Expiration Date", all the remaining sessions will be forfeited.
          The time of sessions is to be agreed upon between the trainer and the member. You must arrive on time for the scheduled appointment. If you arrive late by any chance, do understand that your session will end at the originally scheduled time.
          The member must give twenty-four (24) hour cancellation notice. It is required for rescheduling or cancelling any and all individual Sessions. Failure to do so will result in forfeiture of the sessions and no sessions or payment reimbursement will be granted.
          Any tardiness of more than 15 minutes or absence without proper notification will result in forfeiting the session and no sessions or payment reimbursement will be granted. All one on one personal training sessions will start and end no more than allocated time, as per purchased package (1 hour & 30 minutes).
          Shall his or her Coach cancel the session within the 24 hour notice period, he or she will be ensured of a substitute Coach for the scheduled session. If the member is not satisfied with services of the current Fitness Instructor/Trainer (provided solid reasons), we will be glad to offer him or her a different Fitness Instructor/Trainer.
          Refunds - All personal training package fees are non-refundable, even if the member cannot or does no participate in all of the training session in the program. There shall be no refund of any monies paid by Babel in any event whatsoever.
          The member is responsible to verify every session with the Fitness Instructor/Trainer by signing a Confirmation of Conducted Personal Training Sessions form (COC).
          Babel reserves the right to assign a different Fitness Instructor/Trainer to the member at any time without prior notice.
          Babel reserves the rights to sell personal training package at different rates and terms, without prior notice.
          Fitness Instructor/Trainer expressly notes that results will differ for each individual member based upon various factors including without limitation; body type, nutrition, etc. and no guarantees of results are possible.
          Proper nutrition and adequate rest are essential to this training program and the member must not be under the influence of drugs or alcohol at any time during the training session.
          During each session the member is required to wear appropriate athletic footwear and loose, comfortable clothing to facilitate ease of movement. The member is not permitted to bring other individuals with him or her to the sessions unless the purchased session allows him or her to do so e.g. Buddy Personal Training.
          Fitness Instructor/Trainer is not responsible for the safety of facilities or equipment whether provided by member, Fitness Instructor/Trainer, or others.
          No implied warranties or representations are made other than those expressly contained herein and this document contains all of the terms of the Agreement between the parties.`}</Typography>
        <Typography type="title" component="h1" color="primary" style={{marginBottom:16, marginLeft:'auto', marginRight:'auto', color:'rgba(0, 0, 0, 0.54)', textAlign:'center'}}>
          {`DAY PASS | DANCE PASS`}</Typography>


        <Typography type="title" component="h1" color="primary" style={{marginBottom:16, marginLeft:'auto', marginRight:'auto', color:'rgba(0, 0, 0, 0.54)', textAlign:'center'}}>
          {`DAY PASS`}</Typography>
        <Typography type="body1" component="h1" color="primary" style={{marginBottom:16, marginLeft:'auto', marginRight:'auto', color:'rgba(0, 0, 0, 0.54)', textAlign:'justify'}}>
          {`The Day Pass holder is entitled to use the specified outlet's facilities for that day with unlimited access, which includes the gymnasium, the swimming pool if any, and attend classes and will expire by the end of the specified day, subject to Babel's opening hours.
          The Day Pass is only valid for one (1) individual and is non-assignable, non-refundable and non-transferable once it has been assigned to him or her.
          The Day Pass holder will be subjected to Babel's rules and the general terms and conditions below and the Management reserves the right to refuse entry and terminate the validity of the pass immediately if the holder was found not observing the said rules.
          The Day Pass holder can book classes either over-the-counter at specified outlet's reception or call the front desk in advance. Bookings for classes will be open three (3) days in advance and he or she can check the schedule at www.babel.fit/schedule. Spaces are not guaranteed and are subject to availability.
          In the event where there are changes to the class' time, venue, instructor or the type of workout due to unforeseen circumstances, Babel will try to inform in advance but it is highly advisable to check the schedule before coming over to the gym. Babel will try to manage this risk but will not be held responsible for the inconvenience it may caused arising from this change.
          The Day Pass holder is not entitled to membership perks e.g. Babel Perks with partnered brands and retail and food and beverages discounts and is not allowed to purchase personal training sessions.
          The Management reserves the right to refuse any sale of Day Pass for any reason whatsoever.
          Refunds - Day Pass sold is NOT refundable for any reason whatsoever and is not available for resale.`}</Typography>

          <Typography type="title" component="h1" color="primary" style={{marginBottom:16, marginLeft:'auto', marginRight:'auto', color:'rgba(0, 0, 0, 0.54)', textAlign:'center'}}>
            {`DANCE PASS`}</Typography>
          <Typography type="body1" component="h1" color="primary" style={{marginBottom:16, marginLeft:'auto', marginRight:'auto', color:'rgba(0, 0, 0, 0.54)', textAlign:'justify'}}>
            {`The Dance Pass holder is only entitled to book for one (1) dance class, either Choreography by Mayhem, GRIIND or Groove Thang, at the specified outlet and will expire by the end of the specified day, subject to Babel's opening hours.
            The Dance Pass holder can book the class either over-the-counter at specified outlet's reception or call the front desk in advance. Bookings for classes will be open three (3) days in advance and he or she can check the schedule at www.babel.fit/schedule. Spaces are not guaranteed and are subject to availability.
            The Dance Pass is only valid for one (1) individual and is non-assignable, non-refundable and non-transferable once it has been assigned to him or her.
            The Dance Pass holder will be subjected to Babel's rules and the general terms and conditions below and the Management reserves the right to refuse entry and terminate the validity of the pass immediately if the holder was found not observing the said rules.
            In an uncommon event of over-booking where a spot has been reserved for the holder by Babel but is unable to attend the class because it is full, the holder will be entitled to select a different day of the dance classes above by the same dance instructor.
            In an uncommon event where there is any changes to the timing, venue, instructor or the type of workout that occurred due to unforeseen circumstances, Babel will try to inform the participants in advance but it is highly advisable to check the schedule before coming over to the gym. Babel will try to manage this risk but will not be held responsible for the inconvenience it may caused arising from this change.
            The Dance Pass holder is not entitled to membership perks e.g. Babel Perks with partnered brands and retail and food and beverages discounts and is not allowed to purchase personal training sessions.
            The Management also reserves the right to refuse any sale of Dance Pass for any reason whatsoever.
            Refunds - Dance Pass sold is NOT refundable for any reason whatsoever and is not available for resale.`}
          </Typography>

          <Typography type="title" component="h1" color="primary" style={{marginBottom:16, marginLeft:'auto', marginRight:'auto', color:'rgba(0, 0, 0, 0.54)', textAlign:'justify'}}>
            {`DECEMBER 2018 PROMOTION: BABEL ON THE HOUSE`}</Typography>

          <Typography type="body1" component="h1" color="primary" style={{marginBottom:16, marginLeft:'auto', marginRight:'auto', color:'rgba(0, 0, 0, 0.54)', textAlign:'justify'}}>
            {`This promotion is exclusively for non-members only.
            This promotion entitles you to experience one (1) free class from 5th to 31st December 2018. For any additional classes, a fee of RM35.00 will be charged per class.
            You can register for the promotion here. You will receive a confirmation email and you will be required to flash the email to our Customer Service Officers upon checking in.
            We reserve the right to cancel any bookings for any reason.
            For further enquiries, please contact us at 03-7680 0000 or email us at hello@babel.fit.`}
          </Typography>

        <Typography type="title" component="h1" color="primary" style={{marginBottom:16, marginLeft:'auto', marginRight:'auto', color:'rgba(0, 0, 0, 0.54)', textAlign:'justify'}}>
          {`GENERAL`}</Typography>

        <Typography type="title" component="h1" color="primary" style={{marginBottom:16, marginLeft:'auto', marginRight:'auto', color:'rgba(0, 0, 0, 0.54)', textAlign:'center'}}>
          {`PERSONAL FITNESS DECLARATION`}</Typography>
        <Typography type="body1" component="h1" color="primary" style={{marginBottom:16, marginLeft:'auto', marginRight:'auto', color:'rgba(0, 0, 0, 0.54)', textAlign:'justify'}}>
          {`Before engaging into any of our fitness activities, we strongly advise that you obtain a medical clearance from a Doctor if you have any doubts about your physical capability to engage in any exercise.
          You are to abide with Babel's rules and instructions including warning notices when using our equipment and facilities. If you experience any illness or discomfort physically, please notify us immediately. We are not responsible in terms of medical requirements of our members.`}</Typography>
        <Typography type="title" component="h1" color="primary" style={{marginBottom:16, marginLeft:'auto', marginRight:'auto', color:'rgba(0, 0, 0, 0.54)', textAlign:'center'}}>
          {'LIMITATION OF LIABILITY'}
        </Typography>
        <Typography type="body1" component="h1" color="primary" style={{marginBottom:16, marginLeft:'auto', marginRight:'auto', color:'rgba(0, 0, 0, 0.54)', textAlign:'justify'}}>
          {`By attending classes, events, activities, using training facilities and equipment, you hereby acknowledge on behalf of yourself, your heirs, personal representatives and/or assigns, that there are certain inherent risks and dangers whilst exercising in Babel. You acknowledge that you have voluntarily chosen to participate in intense physical activity. You hereby agree to assume full responsibility for yourself and all injuries or damage, which are sustained or aggravated by you in relation to the use of equipment and/or our training facilities, and release, indemnify, and hold harmless of Babel.
          Babel accepts no responsibility for loss or damage on members' or their guests' properties or for death or injuries sustained while on the premises. Members and their guests agree that no claims will be made against Babel, the Management or staff for any reason whatsoever.
          Babel, its associated companies, employees or agents shall not be responsible for any claims, demands, injuries, damages or actions for negligence arising on account of death or due to injury, loss, damage or theft to a member's person or property arising out of or in connection with the use by a member of any of the services, facilities on the premises of Babel. The member hereby holds Babel, its associated companies, employees and agents harmless from all claims which may be brought against them by or on a member's behalf for any such injuries or claims aforesaid. Any guest of a member or a temporary visitor to Babel shall agree to abide by Babel's rules and the same limitation of liabilities for a member shall apply. All prices and amount quoted here are subject to taxes where applicable.`}</Typography>

        <Typography type="title" component="h1" color="primary" style={{marginBottom:16, marginLeft:'auto', marginRight:'auto', color:'rgba(0, 0, 0, 0.54)', textAlign:'center'}}>
          {'MEMBERSHIP BILLING'}
        </Typography>

        <Typography type="body1" component="h1" color="primary" style={{marginBottom:16, marginLeft:'auto', marginRight:'auto', color:'rgba(0, 0, 0, 0.54)', textAlign:'justify'}}>
          {`For the Pay Monthly contract, the membership fee for the service and any other charges you may incur in connection with your use of the service, such as taxes and possible transaction fees, will be charged on a monthly basis to your Payment Method on the calendar day corresponding to the commencement of the paying portion of your membership, also known as the “Billing Date”. In some cases your payment date may change, for example if it corresponds to your first visit.
          For the Prepaid 6 Months and 12 Months membership contract, your membership will be automatically converted to the Pay Monthly contract at the end of the billing cycle. If you wish to maintain your 6 Months or 12 Months membership contract, please inform us at hello@babel.fit 7 days before your billing date.
          Corporate Packages’ validity is subjected to the requirements set forth by Babel and agreed by the corporate client. Babel reserves the right to revise the membership plan back to the original shelf prices if those requirements are not met. e.g. no longer a staff of the company or fail to meet the minimum required accounts from the company.
          For Pay Monthly Corporate Packages with 6 Months or 12 Months contract, the membership fee for the service and any other charges you may incur in connection with your use of the service, such as taxes and possible transaction fees, will be charged on a monthly basis to your Payment Method on the calendar day corresponding to the commencement of the paying portion of your membership, also known as the “Billing Date”. In some cases your payment date may change, for example if it corresponds to your first visit. If you wish to terminate your membership before the end of the contract, you are required to settle all outstanding payments and remaining months’ membership fees for the tenure before cancellation can occur. The membership is also subjected to Membership Billing Clause 3.
          To use the service you must provide one or more Payment Methods e.g. debit card or credit card. By adding your card, you authorise us to continue to charge the applicable Payment Method(s). You authorise us to charge any Payment Method associated to your account in case your primary Payment Method is declined or no longer available to us for payment of your subscription fee. You remain responsible for any uncollected amounts.
          We may change our subscription plans and the price of our service from time to time; however, any price changes or changes to our subscription plans, if applicable, will apply to you no earlier than 30 days following notice to you.`}</Typography>

        <Typography type="title" component="h1" color="primary" style={{marginBottom:16, marginLeft:'auto', marginRight:'auto', color:'rgba(0, 0, 0, 0.54)', textAlign:'center'}}>
          {`MISCELLANEOUS`}</Typography>

        <Typography type="body1" component="h1" color="primary" style={{marginBottom:16, marginLeft:'auto', marginRight:'auto', color:'rgba(0, 0, 0, 0.54)', textAlign:'justify'}}>
          {`Soliciting and selling memberships, private personal training sessions, merchandises or retail products to any member are prohibited and shall result in immediate termination of a member concerned without refund.
          Failure by the Management to enforce any of the their respective rights at any time for any period shall not be construed as a waiver of such rights
          The Management reserves the right to use any individual or group photographs of members and/or guests for press or promotional purpose.
          Any guests or members are not allowed to photograph or copy any club interior designs, promotional materials, tag lines or theme.
          All members must abide by the rules of Babel which may be amended, varied, deleted and added from time to time at the Management's discretion.
          Babel reserves the right to proceed with legal action to any member caught distributing, sharing or supplying such contents to any third party vendor or competitor.
          These Rules shall be governed and construed in accordance with the laws of Malaysia and subject to the jurisdiction of Malaysia.`}
        </Typography>

        <Typography type="title" component="h1" color="primary" style={{marginBottom:16, marginLeft:'auto', marginRight:'auto', color:'rgba(0, 0, 0, 0.54)', textAlign:'center'}}>
          {`BABEL ACADEMY`}
        </Typography>

        <Typography type="body1" component="h1" color="primary" style={{marginBottom:16, marginLeft:'auto', marginRight:'auto', color:'rgba(0, 0, 0, 0.54)', textAlign:'justify'}}>
        {`Any individual or body (collectively known as “Client”) who is interested in registering for the programmes, training, courses, workshops, events or other activities organised under the brand Babel Academy (collectively known as "workshops") will be subjected to the following terms and conditions.
        Registration constitutes a request by the Client to apply for and attend a specific workshop, however, such request shall not result in a workshop booking/reservation unless and until full payment has been received and successfully processed and verified.
        The Management reserves the right to reject any application for the workshops for any reason whatsoever.
        The workshop fee, unless stated, covers the provision of workshop material and documentation, if any.
        In the event that the workshop is completed within the allocated time period thereby resulting in an early finish, no adjustment to the fee may be requested and in no such case will Babel grant a refund.
        By registering and paying for workshops where Babel is a distributor, administrator, agent, partner or the equivalents for a third party, the Client hereby agrees to the terms and conditions set forth by the said third party.
        For workshops that provide certification by a third party, Babel will not be responsible and liable for the said certification. Any disputes or requests regarding the certification shall be directed to the third party by the Client.
        Refunds and Cancellation - The Client may cancel his or her registration for any workshop with a minimum of fifteen (15) business days’ written notice. No refunds of payments effected shall be given. In the event that the Client’s notice for cancellation is less than the minimum requirement above, the full fee shall remain chargeable and no refund will be granted to the Client.
        Babel reserves the right, at any time and for any reason, to cancel, reschedule or re-arrange the date allocated for any workshop. In the event that a workshop is cancelled or a Client will not be able to attend the said workshop on the rescheduled date, Babel shall provide the Client with a full refund of the fee paid for the cancelled or rescheduled Course and there will be no further liability upon Babel.
        Client is responsible for advance notification to Babel of any special requirements or physical issues he or she may face. Babel will endeavour to accommodate such notified needs if it is considered both reasonable and practical to do so.
        In very rare circumstances the stated maximum class size might be exceeded where a spot has been reserved for the Client by Babel but is unable to attend the class because it is full, the Client will be entitled for a refund or convert the amount into credits which can be used for any other Babel products and services.
        Babel reserves the right to exclude any Client from any workshop due to disorderly conduct or failure to adhere to Babel’s rules. The relevant fee shall remain chargeable to Client in such circumstances and not refundable, if paid.
        Babel may photograph or film the workshops of which the Client may be in it for marketing purposes. These images may be used on Babel’s website, Babel App, social media or any other marketing materials.
        The copyright in and all other intellectual property (IP) rights relating to the workshop, data and documentation employed by Babel and any related materials provided to are owned exclusively by and hereby reserved to Babel and/or its party licensors. Babel hereby grants to the Client a non-exclusive, non-transferable, non-sub-licensable licence to use such materials solely for the purpose of receiving the workshop. Under no circumstances may any part of the materials be produced or copied in any form or by any means or translated into another language by the Client.
        The workshop and any materials provided are not intended to be a definitive or comprehensive analysis of the subject and should not be deemed to constitute a substitute for professional advice.
        Babel reserves the right to amend the content of any workshop without prior notice when, in the opinion of Babel, such amendment does not fundamentally change the content of such workshop.`}
        </Typography>

        <Typography type="title" component="h1" color="primary" style={{marginBottom:16, marginLeft:'auto', marginRight:'auto', color:'rgba(0, 0, 0, 0.54)', textAlign:'center'}}>
          {`PRIVACY POLICY`}
        </Typography>

        <Typography type="body1" component="h1" color="primary" style={{marginBottom:16, marginLeft:'auto', marginRight:'auto', color:'rgba(0, 0, 0, 0.54)', textAlign:'justify'}}>
          {`Babel respects your privacy and use your personal information in an effort to offer our members the perfect wellness experience. The Privacy Policy describes the privacy practices of Babel, including the types of personal information we collect from our members and guests and from other users of our website, official social media platforms and the downloadable Babel-branded mobile application (collectively known as “Babel App”), how we use this personal information and with whom we share it, in accordance with the Personal Data Protection Act 2010. By using or interacting with the Babel App, you are acknowledging that you have read, understand and agreed to and expressly consent to our collection, use and disclosure of your personal information, as described in the Privacy Policy.`}
        </Typography>
      </div>
    );
  }
}

export default TermsConditions;
