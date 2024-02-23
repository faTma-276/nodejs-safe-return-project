export function calculateAge(dob) {
    var today = new Date();
    var birthDate = new Date(dob);
    var age =Math.round((today - birthDate) / (1000 * 60 * 60 * 24) /365.25);
    

    return age;
}
