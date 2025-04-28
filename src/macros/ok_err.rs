// macro_rules! ok_err {
//     ($ex:expr, $err:expr) => {{
//         match $ex {
//             Ok(x) => x,
//             $err,
//         }
//     }};
// }

// macro_rules! ok_err {
//     // Original syntax
//     // ($expr:expr, Err($err_var:ident) => $err_block:block) => {
//     //     match $expr {
//     //         Ok(value) => value,
//     //         Err($err_var) => $err_block,
//     //     }
//     // };
//     ($expr:expr, $err_message:expr) => {
//         match $expr {
//             Ok(value) => value,
//             Err(e) => {
//                 error!("{} {e}", $err_message);
//                 return (
//                     StatusCode::INTERNAL_SERVER_ERROR,
//                     format!("{}", $err_message).into_response(),
//                 );
//             }
//         }
//     };
// }

// pub(crate) use ok_err;
